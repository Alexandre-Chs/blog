type NavigationNameProps = {
  name: string
  subtitle?: string
}

export default function NavigationName({ name, subtitle }: NavigationNameProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{name}</h1>
      {subtitle && <span className="mt-1 ml-[2px] block text-sm text-gray-500">{subtitle}</span>}
    </div>
  )
}
