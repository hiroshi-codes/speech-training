export interface Topic {
  id: number;
  level: number;
  category: string;
  text: string;
}

export interface TopicsData {
  version: string;
  total_count: number;
  topics: Topic[];
}