export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

export interface Note {
  id: string;
  title: string;
  strokes: Stroke[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}
