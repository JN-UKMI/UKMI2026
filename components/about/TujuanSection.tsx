export type TujuanItemProps = {
  item: string;
};

function TujuanItem({ item }: TujuanItemProps) {
  return (
    <li className="my-8">
      <span className="text-5xl font-bold text-forest-900 leading-none block mb-6">
        0{item}
      </span>
      <div className="h-px bg-forest-600 mb-8" />
      <p className="text-base text-muted leading-relaxed">{item}</p>
    </li>
  );
}

type TujuanSectionProps = {
  tujuan: string[];
};

export function TujuanSection({ tujuan }: TujuanSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-forest-900 mb-12 text-center">
          Tujuan
        </h2>
        <ol className="space-y-0">
          {tujuan.map((item, index) => (
            <TujuanItem key={index} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}