import { FaArrowRight } from "react-icons/fa";

const RecommendationSection = ({
  title,
  subtitle,
  children,
  onViewAll,
}) => {
  return (
    <section className="mb-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-4">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}

        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            View All

            <FaArrowRight />

          </button>
        )}

      </div>

      {/* Horizontal Scroll */}

      <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">

        {children}

      </div>

    </section>
  );
};

export default RecommendationSection;