const EmptyState = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      {icon && (
        <div className="mb-4 text-5xl text-gray-300">
          {icon}
        </div>
      )}

      <h3 className="mb-1 text-lg font-semibold text-gray-700">
        {title}
      </h3>

      {description && (
        <p className="mb-4 text-sm text-gray-400">
          {description}
        </p>
      )}

      {children}
    </div>
  );
};

export default EmptyState;