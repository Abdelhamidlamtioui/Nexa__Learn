export interface DocumentationDTO {
    id?: string;
    title: string;
    content: string;
    technology: string;
    status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
    tags?: string[];
    views?: number;
    authorId?: string;
    authorUsername?: string;
    sections?: DocumentationSectionDTO[];
    createdAt?: string;
    lastUpdatedAt?: string;
    version?: number;
    lastModifiedBy?: string;
}

export interface DocumentationSectionDTO {
    id?: string;
    documentationId?: string;
    title: string;
    content: string;
    orderIndex?: number;
    sectionId?: string;
    createdAt?: string;
    lastUpdatedAt?: string;
    lastModifiedBy?: string;
}

export interface DocumentationReviewData {
  approved: boolean;
  feedback: string;
}

export interface DocumentationStats {
  statusDistribution: Record<string, number>;
  technologyDistribution: Record<string, number>;
  readingTime: number;
  totalViews: number;
}

export interface ModeratorQueueItem {
  id: string;
  title: string;
  status: string;
  submittedAt: Date;
  author: string;
}

export interface DocumentationWithSections extends DocumentationDTO {
  sections: DocumentationSectionDTO[];
}

export interface ReadingTimeResponse {
  readingTimeMinutes: number;
  readingTimeFormatted: string;
}