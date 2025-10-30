import type { PartData, PartXML } from '~/types/partXml'

/**
 * 부품 데이터를 XML로 변환하고 XML에서 부품 데이터로 변환하는 유틸리티
 */

// XML 이스케이프 처리
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// XML 언이스케이프 처리
function unescapeXml(safe: string): string {
  return safe
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

// 객체를 XML 요소로 변환
function objectToXml(obj: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent)
  let xml = ''

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue

    if (typeof value === 'object' && !Array.isArray(value)) {
      xml += `${spaces}<${key}>\n`
      xml += objectToXml(value, indent + 1)
      xml += `${spaces}</${key}>\n`
    } else if (Array.isArray(value)) {
      xml += `${spaces}<${key}>\n`
      value.forEach((item) => {
        if (typeof item === 'object') {
          xml += `${spaces}  <item>\n`
          xml += objectToXml(item, indent + 2)
          xml += `${spaces}  </item>\n`
        } else {
          xml += `${spaces}  <item>${escapeXml(String(item))}</item>\n`
        }
      })
      xml += `${spaces}</${key}>\n`
    } else {
      xml += `${spaces}<${key}>${escapeXml(String(value))}</${key}>\n`
    }
  }

  return xml
}

// 부품 데이터를 XML로 변환
export function partToXml(data: PartData): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<part xmlns="http://electric-circuit-web.com/schema/part/v1">\n'

  // Metadata
  if (data.metadata) {
    xml += '  <metadata>\n'
    xml += objectToXml(data.metadata, 2)
    xml += '  </metadata>\n'
  }

  // Symbol (JointJS 정의를 JSON으로 저장)
  if (data.symbol) {
    xml += '  <symbol>\n'
    xml += `    <jointjs>${escapeXml(JSON.stringify(data.symbol, null, 2))}</jointjs>\n`
    xml += '  </symbol>\n'
  }

  // Electrical Specifications
  if (data.electricalSpecs) {
    xml += '  <electricalSpecifications>\n'
    xml += objectToXml(data.electricalSpecs, 2)
    xml += '  </electricalSpecifications>\n'
  }

  // Physical Specifications
  if (data.physicalSpecs) {
    xml += '  <physicalSpecifications>\n'
    xml += objectToXml(data.physicalSpecs, 2)
    xml += '  </physicalSpecifications>\n'
  }

  // Certifications and Standards
  if (data.certifications) {
    xml += '  <certifications>\n'
    xml += objectToXml(data.certifications, 2)
    xml += '  </certifications>\n'
  }

  // 3D Model
  if (data.model3d) {
    xml += '  <model3d>\n'
    xml += objectToXml(data.model3d, 2)
    xml += '  </model3d>\n'
  }

  // Documentation
  if (data.documentation) {
    xml += '  <documentation>\n'
    xml += objectToXml(data.documentation, 2)
    xml += '  </documentation>\n'
  }

  // Inventory and Pricing
  if (data.inventory) {
    xml += '  <inventory>\n'
    xml += objectToXml(data.inventory, 2)
    xml += '  </inventory>\n'
  }

  xml += '</part>'

  return xml
}

// XML에서 부품 데이터로 변환
export function xmlToPart(xml: string): PartData {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  // 파싱 에러 체크
  const parserError = doc.querySelector('parsererror')
  if (parserError) {
    throw new Error('XML parsing error: ' + parserError.textContent)
  }

  const partElement = doc.querySelector('part')
  if (!partElement) {
    throw new Error('Invalid part XML: missing <part> root element')
  }

  // 재귀적으로 XML 요소를 객체로 변환
  function xmlElementToObject(element: Element): any {
    const obj: any = {}

    // 자식 요소들 처리
    Array.from(element.children).forEach((child) => {
      const tagName = child.tagName

      // 배열 처리
      if (child.children.length > 0 && child.children[0].tagName === 'item') {
        obj[tagName] = Array.from(child.children).map((item) => {
          if (item.children.length > 0) {
            return xmlElementToObject(item)
          }
          return unescapeXml(item.textContent || '')
        })
      }
      // 객체 처리
      else if (child.children.length > 0) {
        obj[tagName] = xmlElementToObject(child)
      }
      // 단순 값 처리
      else {
        const value = unescapeXml(child.textContent || '')
        // 숫자 변환 시도
        if (!isNaN(Number(value)) && value !== '') {
          obj[tagName] = Number(value)
        } else if (value === 'true' || value === 'false') {
          obj[tagName] = value === 'true'
        } else {
          obj[tagName] = value
        }
      }
    })

    return obj
  }

  const partData: any = {}

  // Metadata
  const metadataEl = partElement.querySelector('metadata')
  if (metadataEl) {
    partData.metadata = xmlElementToObject(metadataEl)
  }

  // Symbol (JointJS JSON)
  const symbolEl = partElement.querySelector('symbol > jointjs')
  if (symbolEl) {
    try {
      partData.symbol = JSON.parse(unescapeXml(symbolEl.textContent || ''))
    } catch (e) {
      console.error('Failed to parse symbol JSON:', e)
    }
  }

  // Electrical Specifications
  const electricalEl = partElement.querySelector('electricalSpecifications')
  if (electricalEl) {
    partData.electricalSpecs = xmlElementToObject(electricalEl)
  }

  // Physical Specifications
  const physicalEl = partElement.querySelector('physicalSpecifications')
  if (physicalEl) {
    partData.physicalSpecs = xmlElementToObject(physicalEl)
  }

  // Certifications
  const certificationsEl = partElement.querySelector('certifications')
  if (certificationsEl) {
    partData.certifications = xmlElementToObject(certificationsEl)
  }

  // 3D Model
  const model3dEl = partElement.querySelector('model3d')
  if (model3dEl) {
    partData.model3d = xmlElementToObject(model3dEl)
  }

  // Documentation
  const documentationEl = partElement.querySelector('documentation')
  if (documentationEl) {
    partData.documentation = xmlElementToObject(documentationEl)
  }

  // Inventory
  const inventoryEl = partElement.querySelector('inventory')
  if (inventoryEl) {
    partData.inventory = xmlElementToObject(inventoryEl)
  }

  return partData as PartData
}

// XML 유효성 검증
export function validatePartXml(xml: string): { valid: boolean; errors?: string[] } {
  const errors: string[] = []

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')

    // 파싱 에러 체크
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      errors.push('XML parsing error: ' + (parserError.textContent || 'Unknown error'))
      return { valid: false, errors }
    }

    // 루트 요소 체크
    const partElement = doc.querySelector('part')
    if (!partElement) {
      errors.push('Missing <part> root element')
      return { valid: false, errors }
    }

    // 필수 요소 체크
    const metadataEl = partElement.querySelector('metadata')
    if (!metadataEl) {
      errors.push('Missing <metadata> element')
    }

    const symbolEl = partElement.querySelector('symbol')
    if (!symbolEl) {
      errors.push('Missing <symbol> element')
    }

    // Metadata 필수 필드 체크
    if (metadataEl) {
      const requiredFields = ['id', 'partNumber', 'name', 'category', 'manufacturer', 'version']
      requiredFields.forEach((field) => {
        if (!metadataEl.querySelector(field)) {
          errors.push(`Missing required metadata field: ${field}`)
        }
      })
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    errors.push('Unexpected error: ' + (error as Error).message)
    return { valid: false, errors }
  }
}

// PartXML 인터페이스 구현
export const partXmlConverter: PartXML = {
  toXML: partToXml,
  fromXML: xmlToPart,
  validate: validatePartXml,
}
