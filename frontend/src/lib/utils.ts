import axios from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { toast } from 'react-toastify'
import i18n from 'src/i18n'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const displayResponseErrorMessage = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    const apiErrorResponse = error.response.data
    const errorMessage = errorMessageHandler(apiErrorResponse.message)
    toast.error(errorMessage)
  } else {
    toast.error(i18n.t('errorGeneric'))
  }
}

export const errorMessageHandler = (message: string) => {
  switch (message) {
    case 'Last admin cannot delete themselves from project':
      return i18n.t('errorMessages.lastAdminCantLeaveProject')
    case 'Not enough permissions, admin required':
      return i18n.t('permissions.adminRequired')
    case 'Not enough permissions, moderator required':
      return i18n.t('permissions.moderatorRequired')
    case 'Not enough permissions, member required':
      return i18n.t('permissions.memberRequired')
    case 'Error: Project is not active':
      return i18n.t('errorMessages.projectNotActive')
    case 'Project end date cannot be before contract end date':
      return i18n.t('errorMessages.projectEndDateCannotBeBeforeContractEnd')
    case 'Project end date must be the last day of a month':
      return i18n.t('errorMessages.projectEndDateMustBeALastDayOfAMonth')
    case 'Project end date cannot be before the earliest termination date':
      return i18n.t('errorMessages.projectEndDateConsiderTerminationDuration')
    case 'Last admin cannot delete themselves from customership':
      return i18n.t('errorMessages.lastAdminCantLeaveCustomership')
    case 'User is the only admin in at least one project, deletion cannot be done.':
      return i18n.t('errorMessages.userDeletionFailedLastAdminInProject')
    case 'User is the only admin in at least one customership, deletion cannot be done.':
      return i18n.t('errorMessages.userDeletionFailedLastAdminInCustomership')
    case 'Tag is already associated with this item.':
      return i18n.t('tagAlreadyExistsInItem')
    case 'An error occurred: You cannot reuse an old password.':
      return i18n.t('errorMessages.cannotReuseOldPassword')
    case 'An error occurred: New password must differ from the current password.':
      return i18n.t('errorMessages.cannotReuseOldPassword')
    case 'Location contains items':
      return i18n.t('errorMessages.locationContainsItems')
    case 'Location contains blueprints':
      return i18n.t('errorMessages.locationContainsBlueprints')
    case 'Location is used in location connections':
      return i18n.t('errorMessages.locationContainsConnections')
    case 'Location contains notification settings':
      return i18n.t('errorMessages.locationContainsNotificationSettings')
    default:
      return i18n.t('errorGeneric')
  }
}
