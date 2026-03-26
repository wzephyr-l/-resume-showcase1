'use client';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (stepId: number) => void;
  completedSteps?: number[];
}

export default function StepIndicator({
  currentStep,
  steps,
  onStepClick,
  completedSteps = []
}: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* 连接线背景 */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" />

        {/* 动态连接线 */}
        <div
          className="absolute top-6 left-0 h-0.5 bg-blue-500 -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = onStepClick && (step.id <= currentStep || completedSteps.includes(step.id - 1));

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* 步骤圆圈 */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300 transform
                  ${isCompleted
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : isCurrent
                      ? 'bg-blue-500 text-white shadow-lg scale-110 ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                  }
                  ${isClickable ? 'cursor-pointer hover:scale-115' : 'cursor-default'}
                `}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </button>

              {/* 步骤标题 */}
              <div className="mt-3 text-center">
                <p className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-[120px]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}