import React from 'react';
import { Tag, Tooltip } from 'antd';
import { ShieldCheck, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import type { RemedyRelationship } from '../types';

interface RelationshipBadgesProps {
  relationships: RemedyRelationship[];
  onSelectRemedy?: (remedyId: string) => void;
}

export const RelationshipBadges: React.FC<RelationshipBadgesProps> = ({
  relationships,
  onSelectRemedy,
}) => {
  if (relationships.length === 0) {
    return <span className="text-xs text-text-muted italic">No verified relationships recorded</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {relationships.map((rel) => {
        let color = 'default';
        let icon = <ArrowRight className="w-3 h-3 inline mr-1" />;

        if (rel.type === 'complement') {
          color = 'green';
          icon = <Sparkles className="w-3 h-3 inline mr-1" />;
        } else if (rel.type === 'inimical') {
          color = 'error';
          icon = <ShieldAlert className="w-3 h-3 inline mr-1" />;
        } else if (rel.type === 'antidote') {
          color = 'blue';
          icon = <ShieldCheck className="w-3 h-3 inline mr-1" />;
        }

        return (
          <Tooltip key={rel.id} title={`${rel.type.toUpperCase()}: ${rel.notes || 'Verified clinical relationship'}`}>
            <Tag
              color={color}
              className="text-xs py-0.5 px-2 rounded-md cursor-pointer hover:opacity-85 transition-opacity font-medium m-0"
              onClick={() => onSelectRemedy?.(rel.relatedRemedyId)}
            >
              {icon}
              <span className="font-bold">{rel.relatedAbbr}</span>
              <span className="text-[10px] opacity-75 ml-1 lowercase">({rel.type})</span>
            </Tag>
          </Tooltip>
        );
      })}
    </div>
  );
};
