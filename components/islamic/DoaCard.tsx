type DoaCardProps = {
  arabic: string;
  latin: string;
  terjemahan: string;
};

export function DoaCard({ arabic, latin, terjemahan }: DoaCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <p
        className="text-2xl md:text-3xl leading-[2.2] text-right mb-4"
        style={{ fontFamily: "serif" }}
        dir="rtl"
      >
        {arabic}
      </p>
      <p className="text-sm text-gray-500 italic mb-2">{latin}</p>
      <p className="text-gray-700 leading-relaxed">{terjemahan}</p>
    </div>
  );
}
