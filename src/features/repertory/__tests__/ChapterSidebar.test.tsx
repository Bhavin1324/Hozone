import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChapterSidebar } from '../components/ChapterSidebar';
import type { Chapter } from '../types';

describe('ChapterSidebar Component', () => {
  const sampleChapters: Chapter[] = [
    {
      id: 'chap-mind',
      name: 'Mind',
      displayOrder: 1,
      icon: 'Brain',
      rubricCount: 5939,
    },
    {
      id: 'chap-head',
      name: 'Head',
      displayOrder: 2,
      icon: 'Smile',
      rubricCount: 6988,
    },
    {
      id: 'chap-extremities',
      name: 'Extremities',
      displayOrder: 3,
      icon: 'Activity',
      rubricCount: 16118,
    },
    {
      id: 'chap-vertigo',
      name: 'Vertigo',
      displayOrder: 4,
      icon: 'RotateCw',
      rubricCount: 0,
    },
  ];

  it('renders chapters with formatted rubric count badges', () => {
    render(
      <ChapterSidebar
        chapters={sampleChapters}
        selectedChapterId="chap-mind"
        onSelectChapter={vi.fn()}
      />
    );

    expect(screen.getByText('Mind')).toBeDefined();
    expect(screen.getByText('Head')).toBeDefined();
    expect(screen.getByText('Extremities')).toBeDefined();
    expect(screen.getByText('5,939')).toBeDefined();
    expect(screen.getByText('6,988')).toBeDefined();
    expect(screen.getByText('16,118')).toBeDefined();
  });

  it('renders search hit counts when isSearchActive is true', () => {
    const searchResultChapters: Chapter[] = [
      {
        id: 'chap-mind',
        name: 'Mind',
        displayOrder: 1,
        icon: 'Brain',
        rubricCount: 22,
      },
      {
        id: 'chap-head',
        name: 'Head',
        displayOrder: 2,
        icon: 'Smile',
        rubricCount: 13,
      },
      {
        id: 'chap-vertigo',
        name: 'Vertigo',
        displayOrder: 3,
        icon: 'RotateCw',
        rubricCount: 0,
      },
    ];

    render(
      <ChapterSidebar
        chapters={searchResultChapters}
        selectedChapterId={null}
        onSelectChapter={vi.fn()}
        isSearchActive={true}
      />
    );

    expect(screen.getByText('22')).toBeDefined();
    expect(screen.getByText('13')).toBeDefined();
    expect(screen.getByText('0')).toBeDefined();
  });

  it('invokes onSelectChapter when a chapter button is clicked', () => {
    const onSelect = vi.fn();
    render(
      <ChapterSidebar
        chapters={sampleChapters}
        selectedChapterId={null}
        onSelectChapter={onSelect}
      />
    );

    const headButton = screen.getByText('Head').closest('button');
    expect(headButton).not.toBeNull();
    fireEvent.click(headButton!);
    expect(onSelect).toHaveBeenCalledWith('chap-head');
  });
});
