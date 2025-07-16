import clsx from 'clsx'

export default function SmallLoadingCircleOnly({
  borderColor = 'border-sky-600',
}: {
  borderColor?: string
}) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={clsx(
          'border-t-4 border-solid rounded-full h-6 w-6 animate-spin',
          {
            [borderColor]: borderColor.length > 0,
          }
        )}
      ></div>
    </div>
  )
}
