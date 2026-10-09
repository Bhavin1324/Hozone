import React, { useMemo } from 'react';
import { Card, Input, Button, Tag, Empty, message } from 'antd';
import {
  Brain,
  Plus,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setSehgalQuery } from '@/app/store/slices/expertSystemsSlice';
import { addRubric } from '@/app/store/slices/repertorizationSlice';
import type { SehgalScript } from '../types';
import type { Rubric, RubricRemedyEntry } from '@/features/repertory/types';
import { translatePatientNarration } from '@/core/expert-systems/sehgalEngine';

interface SehgalMindRubricTranslatorProps {
  scripts: SehgalScript[];
}

export const SehgalMindRubricTranslator: React.FC<SehgalMindRubricTranslatorProps> = ({
  scripts,
}) => {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.expertSystems.sehgalQuery);
  const activeRubrics = useAppSelector((state) => state.repertorization.activeRubrics);

  const translationResult = useMemo(() => {
    return translatePatientNarration(query, scripts);
  }, [query, scripts]);

  const handleAddRubricToClipboard = (script: SehgalScript) => {
    // Construct rubric object matching active rubric clipboard
    const rubricId = `rub-sehgal-${script.id}`;
    const rubricEntries: RubricRemedyEntry[] = script.topRemedies.map((abbr, idx) => ({
      remedyId: `rem-${abbr.toLowerCase().replace(/[^a-z]/g, '')}`,
      abbreviation: abbr,
      grade: (Math.max(1, 4 - idx) as 1 | 2 | 3 | 4),
    }));

    const newRubric: Rubric = {
      id: rubricId,
      chapterId: 'chap-mind',
      chapterName: 'Mind',
      path: script.rubricPath,
      fullPath: script.rubricFullPath,
      depth: 2,
      remedyCount: script.topRemedies.length,
      entries: rubricEntries,
    };

    dispatch(addRubric(newRubric));
    message.success(`Added rubric "${script.rubricPath}" to consultation clipboard.`);
  };

  const samplePhrases = [
    'I feel completely light, as if floating in the air',
    'I keep checking the lock and the stove over and over again',
    'I just want everyone to leave me alone in peace and quiet',
    'I smile and laugh even when explaining how terrible my illness is',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Sehgal Expert System (Revolutionized Homeopathy)
            </h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Mind-Rubric conversion engine: Translates patient colloquial narrations into classical Mind rubrics.
          </p>
        </div>
        <Tag color="purple" className="font-semibold text-xs">
          Mind Conversion Engine
        </Tag>
      </div>

      {/* Input Box & Quick Samples */}
      <Card className="border-border-subtle shadow-xs">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
          Patient Colloquial Dialogue / Behavioral Narrative:
        </label>
        <Input.TextArea
          rows={3}
          placeholder="Paste or type patient's exact words (e.g. 'I feel light like I am floating', 'I keep checking if the door is locked', 'I smile when talking about my pain')..."
          value={query}
          onChange={(e) => dispatch(setSehgalQuery(e.target.value))}
          className="rounded-xl text-sm"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-primary-500" />
            Quick Test Prompts:
          </span>
          {samplePhrases.map((phrase, idx) => (
            <Tag
              key={idx}
              className="cursor-pointer hover:border-primary-500 hover:text-primary-600 transition-colors text-xs"
              onClick={() => dispatch(setSehgalQuery(phrase))}
            >
              &quot;{phrase.slice(0, 36)}...&quot;
            </Tag>
          ))}
        </div>
      </Card>

      {/* Matching Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Converted Classical Mind Rubrics ({translationResult.matchedScripts.length} matches)
          </span>
        </div>

        {translationResult.matchedScripts.length === 0 ? (
          <Card className="border-border-subtle text-center py-8">
            <Empty
              description={
                query.trim()
                  ? 'No direct Sehgal script matches found for this statement. Try rephrasing or selecting a sample prompt.'
                  : 'Type or click a patient statement above to convert colloquial expressions into classical Mind rubrics.'
              }
            />
          </Card>
        ) : (
          translationResult.matchedScripts.map((script) => {
            const isAlreadyAdded = activeRubrics.some(
              (r) => r.fullPath === script.rubricFullPath || r.rubricId === `rub-sehgal-${script.id}`
            );

            return (
              <Card
                key={script.id}
                className="border-border-subtle hover:border-primary-500/40 transition-colors shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <Tag color="blue" className="text-xs font-mono font-semibold">
                        {script.rubricChapter}
                      </Tag>
                      <h4 className="text-base font-bold text-text-primary tracking-tight">
                        {script.rubricPath}
                      </h4>
                    </div>

                    <p className="text-xs font-mono text-text-muted">
                      Full Path: {script.rubricFullPath}
                    </p>

                    <p className="text-xs text-text-secondary leading-relaxed pt-1">
                      <span className="font-semibold text-text-primary">Clinical Context: </span>
                      {script.clinicalNotes}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-xs text-text-muted font-medium">Top Remedies:</span>
                      {script.topRemedies.map((rem, rIdx) => (
                        <Tag key={rIdx} color="cyan" className="font-mono text-xs">
                          {rem}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                    <Tag color="purple" className="text-xs font-semibold m-0">
                      Score: {script.matchScore}
                    </Tag>
                    <Button
                      type={isAlreadyAdded ? 'default' : 'primary'}
                      size="small"
                      disabled={isAlreadyAdded}
                      icon={isAlreadyAdded ? <Check className="w-3.5 h-3.5 mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
                      onClick={() => handleAddRubricToClipboard(script)}
                    >
                      {isAlreadyAdded ? 'In Case Clipboard' : 'Add to Clipboard'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
