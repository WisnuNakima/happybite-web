import Icon from '@/components/Icon'
import MotionItem from './MotionItem'

export default function StepCard({ number, title, icon, description }) {
  return (
    <MotionItem className="rounded-[30px] bg-peach p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-baked text-sm font-bold text-white">
          {number}
        </span>
        <Icon name={icon} className="h-6 w-6 text-baked" />
      </div>
      <h3 className="text-lg font-semibold leading-6">{title}</h3>
      <p className="mt-3 text-sm leading-5 text-muted">{description}</p>
    </MotionItem>
  )
}
