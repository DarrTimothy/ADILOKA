export interface AuthRoot {
  success: boolean;
  message: string;
  result: AuthResult;
}

export interface AuthResult {
  id: number;
  username: string;
  email: string;
  role: string;
  access_token: string;
  expires_in: number;
}

export interface Media {
  type: "image" | "video";
  url: string;
  source_page?: string;
  caption?: string | null;
}

export interface Game {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  howToPlay: string;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  duration?: number | null;
  image: string;
  cover_img?: string;
  videoUrl: string;
  videoThumbnail?: string;
  is_completed?: boolean;
  media?: GameMedia[];
}

export interface Region {
  id: number;
  province_name: string;
  bps_code: string;
  geometry_type: string;
  is_completed: boolean;
  coordinates: number[][][][];
}

export interface QuizOption {
  id: number;
  quiz_question_id: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  title: string;
  min_score: number;
  time_limit: number;
  is_active: boolean;
  questions: QuizQuestion[];
}
