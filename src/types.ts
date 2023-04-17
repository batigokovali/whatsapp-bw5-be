export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface Chat {
  members: User[];
  messages: Message[];
}

export interface Message {
  sender: User;
  content: {
    text?: string;
    media?: string;
  };
  timestamp: number;
}
