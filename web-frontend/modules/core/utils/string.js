import {
  featureFlagIsEnabled,
  getFeatureFlags,
} from '@baserow/modules/core/utils/env'

export const uuid = function () {
  let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

export const upperCaseFirst = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Source:
 * https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
 */
export const slugify = (string) => {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * A very lenient URL validator that allows all types of URL as long as it respects
 * the maximal amount of characters before the dot at at least have one character
 * after the dot.
 */
export const isValidURL = (str) => {
  const pattern = /^[^\s]{0,255}(?:\.|\/\/)[^\s]{1,}$/i
  return !!pattern.test(str)
}

/**
 * A slightly stricter URL validator than requires any url begins with a http:// or
 * https:// and that it also passes the isValidURL validator above.
 */
export const isValidURLWithHttpScheme = (str) => {
  const trimmedStr = str.trim()
  const pattern = /^https?:\/\//i
  return !!pattern.test(trimmedStr) && isValidURL(trimmedStr)
}

/**
 * An even stricter validator that makes sure that https:// is prepended and that there
 * is at least a domain name.
 */
export const isValidAbsoluteURL = (str) => {
  const pattern = /^[^\s]{0,255}(\.)[^\s]{2,}$/i
  return isValidURLWithHttpScheme(str) && pattern.test(str)
}

export const isValidEmail = (str) => {
  // Please keep these regex in sync with the backend
  // See baserow.contrib.database.fields.field_types.EmailFieldType
  // JavaScript does not support using \w to match unicode letters like python.
  // Instead we match all unicode letters including ones with modifiers by using the
  // regex \p{L}\p{M}* taken from https://www.regular-expressions.info/unicode.html
  // Unicode Categories section.
  const lookahead = /(?=^.{3,254}$)/
  // The regex property escapes below are supported as of ES 2018.
  const localAndDomain = /([-.[\]!#$&*+/=?^_`{|}~0-9]|\p{L}\p{M}*)+/
  const start = /^/
  const at = /@/
  const end = /$/
  const pattern = new RegExp(
    lookahead.source +
      start.source +
      localAndDomain.source +
      at.source +
      localAndDomain.source +
      end.source,
    'iu'
  )

  return !!pattern.test(str)
}

export const getFilenameFromUrl = (url) => {
  const pathname = new URL(url).pathname
  const index = pathname.lastIndexOf('/')
  return pathname.substring(index + 1) // if index === -1 then index+1 will be 0
}

// Regex duplicated from
// src/baserow/contrib/database/fields/field_types.py#PhoneNumberFieldType
// Docs reference what characters are valid in PhoneNumberFieldType.getDocsDescription
// Ensure they are kept in sync.
export const isSimplePhoneNumber = (str) => {
  const pattern = /^[0-9NnXx,+._*()#=;/ -]{1,100}$/
  return pattern.test(str)
}

export const isSecureURL = (str) => {
  return str.toLowerCase().substr(0, 5) === 'https'
}

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const isNumeric = (value) => {
  return /^-?\d+$/.test(value)
}

/**
 * Allow to find the next unused name excluding a list of names.
 * This is the frontend equivalent of backend ".find_unused_name()" method.
 *
 * @param {string} baseName
 * @param {string[]} excludeNames
 * @returns the first baseName potentially suffixed with a number that is not in
 * excludedNames.
 *
 * @example
 * // returns 'name'
 * getNextAvailableNameInSequence('name', []);
 *
 * @example
 * // returns 'name 1'
 * getNextAvailableNameInSequence('name', ['name']);
 *
 * @example
 * // returns 'name 2'
 * getNextAvailableNameInSequence('name', ['name', 'name 1', 'name 3']);
 */
export const getNextAvailableNameInSequence = (baseName, excludeNames) => {
  let name = baseName
  let i = 0
  while (i < excludeNames.length) {
    if (!excludeNames.includes(name)) {
      return name
    }
    i++
    name = `${baseName} ${i + 1}`
  }
  return name
}

/**
 * Checks if a search term is a substring of at least one string within a given list of
 * strings.
 *
 * @param strings
 * @param searchTerm
 * @returns boolean
 */
export const isSubstringOfStrings = (strings, searchTerm) => {
  const stringsSanitised = strings.map((s) => s.toLowerCase().trim())
  const searchTermSanitised = searchTerm.toLowerCase().trim()

  return stringsSanitised.some((s) => s.includes(searchTermSanitised))
}

export function collatedStringCompare(stringA, stringB, order) {
  const featureFlags = getFeatureFlags()
  if (featureFlagIsEnabled(featureFlags, 'collation')) {
    return order === 'ASC'
      ? stringA.localeCompare(stringB, 'en')
      : stringB.localeCompare(stringA, 'en')
  } else {
    return order === 'ASC'
      ? stringA.localeCompare(stringB)
      : stringB.localeCompare(stringA)
  }
}
