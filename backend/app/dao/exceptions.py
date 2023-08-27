class DuplicateDataError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


class InvalidPlanIdModuleIdAssociationError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
