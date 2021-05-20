# The core module

## Common module

The common module contains application artifacts used throughout the application. The artifacts are generic and
provide features such as;

- dealing with unexpected errors,
- guard class for generic methods to be used for validation,
- result class to parse validation results,
- test utils for sanitation of data,
- etc.

## Domain module

The domain module contains typical domain driven design artifacts such as Entity, ValueObject, UseCases, Identifier, 
AggregationRoot, DomainEvents, UseCase, etc. 

## Infra module

The infra module contains generic application artifacts to be used as ports to map infrastructure with domain layer.
