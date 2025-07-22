import React from "react";

interface WordListProps {
  words: string[] | undefined;
  foundWords: Set<string>;
}

const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  return (
    <div className="flex flex-row flex-wrap md:flex-col md:flex-nowrap gap-2 justify-center items-start w-full max-w-[300px]">
      {words?.map((word) => (
        <span
          key={word}
          className={`px-2 py-1 rounded border text-sm font-semibold transition
            ${
              foundWords?.has(word)
                ? "bg-green-300 text-white line-through"
                : "bg-white"
            }`}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default React.memo(WordList);
