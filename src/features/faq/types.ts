export type FaqQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type FaqSection = {
  id: string;
  title: string;
  questions: FaqQuestion[];
};

export type FaqPageCopy = {
  title: string;
  description: string;
  stillHaveQuestions: {
    title: string;
    description: string;
    contactUs: string;
    getSupport: string;
  };
};
