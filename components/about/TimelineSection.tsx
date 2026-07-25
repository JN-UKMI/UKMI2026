export type TimelineItemProps = {
  year: string;
  description: string;
};

function TimelineItem({ year, description }: TimelineItemProps) {
  return (
    <div className="relative mb-10 pl-8 border-l-2 border-forest-400 dark:border-lime">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-forest-400 dark:bg-lime" />
      <span className="text-xl font-bold text-forest-800 dark:text-lime block mb-2">
        {year}
      </span>
      <p className="text-base text-muted dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

type TimelineSectionProps = {
  timeline: Array<{ year: string; description: string }>;
};

export function TimelineSection({ timeline }: TimelineSectionProps) {
  return (
    <section className="py-16 px-4 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-forest-900 mb-12 text-center">
          Sejarah
        </h2>
        <div className="text-forest-900">
          {timeline.map((item, index) => (
            <TimelineItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}