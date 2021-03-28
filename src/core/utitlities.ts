/**
 * Simple query helper function
 * Value Objects has only props stored, no id.
 * @param valueObjects The value objects
 * @protected
 */
import { ValueObject } from './domain/ValueObject'

function buildConditions(valueObjects: ValueObject<any>[]) {
  let conditionArray = []

  for (let i = 0; i < valueObjects.length; i++) {
    let condition: any = {}

    // Contains the value object
    if (valueObjects[i].props) {
      let value = valueObjects[i].props
      for (const prop in value) {
        if (value.hasOwnProperty(prop)) {
          condition[prop] = value[prop]
        }
      }
    }

    conditionArray.push(condition)
  }

  return conditionArray
}

/**
 * Build a query object to query if user exist
 * @param valueObjects
 * @private
 */
function buildQuery(valueObjects: ValueObject<any>[]) {
  const conditionArray = buildConditions(valueObjects)
  let query: {}
  if (conditionArray.length === 1) {
    query = conditionArray[0]
  } else {
    query = { $or: conditionArray }
  }

  return query
}
