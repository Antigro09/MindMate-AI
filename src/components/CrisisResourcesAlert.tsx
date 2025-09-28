import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Warning, Phone } from '@phosphor-icons/react'
import { CrisisDetection } from '@/lib/types'

interface CrisisResourcesAlertProps {
  crisisDetection: CrisisDetection
  onDismiss: () => void
  className?: string
}

export function CrisisResourcesAlert({ 
  crisisDetection, 
  onDismiss, 
  className = "" 
}: CrisisResourcesAlertProps) {
  return (
    <Alert className={`border-red-200 bg-red-50 ${className}`}>
      <Warning className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="space-y-3">
          <p className="font-medium">{crisisDetection.supportMessage}</p>
          
          <div>
            <div className="flex items-center gap-2 mb-2 font-medium">
              <Phone size={16} />
              <span>Immediate Support Resources:</span>
            </div>
            <div className="text-sm space-y-2 pl-6">
              {crisisDetection.recommendedResources.map((resource) => (
                <div key={resource.id} className="border-l-2 border-red-300 pl-3">
                  <div className="font-medium flex items-center gap-1">
                    {resource.isEmergency && '🚨'} {resource.name}
                  </div>
                  <div className="text-red-700 font-mono text-sm">{resource.contact}</div>
                  <div className="text-red-600 text-xs mt-1">{resource.description}</div>
                  <div className="text-red-500 text-xs">Available: {resource.availability}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Acknowledge
            </Button>
            <a 
              href="tel:988" 
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              <Phone size={14} className="mr-1" />
              Call 988
            </a>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}