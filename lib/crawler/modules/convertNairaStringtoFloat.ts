const convertNairaStringToFloat = (nairaString: string) => {
  return Number.parseFloat(nairaString.replace("₦", "").replace(/,/g, '').trim())
}

export default convertNairaStringToFloat
