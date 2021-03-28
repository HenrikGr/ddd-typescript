# The core module

The core module contains;

- a common module for generic application services,
- a domain module for common domain classes,
- a infra module for common ports to the application.

## Common module

The common module contains application services used in other modules. The services are generic and
provide features such as;

- dealing with unexpected errors,
- guard class for generic methods to be used for validation,
- result class to parse validation results,
- test utils for sanitation of data,
- etc.

## Domain module

The domain module contains abstract classes and interfaces to support domain driven design, you find
abstract Entity, ValueObject, UseCases, Identifier, AggregationRoot, DomainEvents, etc. 

## infra module

The infra module contains of ports, controllers, to be used to map domain use cases to the application.
