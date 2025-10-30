import type { PartData } from '~/types/partXml'
import { partXmlConverter } from '~/utils/partXmlConverter'

export interface PartListItem {
  id: string
  partNumber: string
  name: string
  category: string
  manufacturer: string
  hasSymbol: boolean
  has3DModel: boolean
  updatedAt: string
}

export const useAdminParts = () => {
  const api = useApi()

  /**
   * 부품 목록 조회 (메타데이터만)
   */
  const fetchPartsList = async (): Promise<PartListItem[]> => {
    try {
      const data = await api.get<PartListItem[]>('/parts/list')
      return data
    } catch (error) {
      console.error('Failed to fetch parts list:', error)
      throw error
    }
  }

  /**
   * 부품 XML 조회
   */
  const fetchPartXml = async (id: string): Promise<string> => {
    try {
      const xml = await api.get<string>(`/parts/${id}/xml`, {
        headers: {
          'Accept': 'application/xml',
        },
      })
      return xml
    } catch (error) {
      console.error('Failed to fetch part XML:', error)
      throw error
    }
  }

  /**
   * 부품 데이터 조회 (XML 파싱됨)
   */
  const fetchPart = async (id: string): Promise<PartData> => {
    try {
      const xml = await fetchPartXml(id)
      return partXmlConverter.fromXML(xml)
    } catch (error) {
      console.error('Failed to fetch part:', error)
      throw error
    }
  }

  /**
   * 부품 생성 (XML 업로드)
   */
  const createPartFromXml = async (xml: string): Promise<{ id: string; partNumber: string }> => {
    try {
      // XML 유효성 검증
      const validation = partXmlConverter.validate(xml)
      if (!validation.valid) {
        throw new Error('Invalid XML: ' + (validation.errors?.join(', ') || 'Unknown error'))
      }

      // 서버로 전송
      const response = await api.post<{ id: string; partNumber: string }>('/parts', xml, {
        headers: {
          'Content-Type': 'application/xml',
        },
      })

      return response
    } catch (error) {
      console.error('Failed to create part from XML:', error)
      throw error
    }
  }

  /**
   * 부품 생성 (데이터 객체)
   */
  const createPart = async (partData: PartData): Promise<{ id: string; partNumber: string }> => {
    try {
      const xml = partXmlConverter.toXML(partData)
      return await createPartFromXml(xml)
    } catch (error) {
      console.error('Failed to create part:', error)
      throw error
    }
  }

  /**
   * 부품 수정 (XML 업로드)
   */
  const updatePartFromXml = async (id: string, xml: string): Promise<void> => {
    try {
      // XML 유효성 검증
      const validation = partXmlConverter.validate(xml)
      if (!validation.valid) {
        throw new Error('Invalid XML: ' + (validation.errors?.join(', ') || 'Unknown error'))
      }

      await api.put(`/parts/${id}`, xml, {
        headers: {
          'Content-Type': 'application/xml',
        },
      })
    } catch (error) {
      console.error('Failed to update part from XML:', error)
      throw error
    }
  }

  /**
   * 부품 수정 (데이터 객체)
   */
  const updatePart = async (id: string, partData: PartData): Promise<void> => {
    try {
      const xml = partXmlConverter.toXML(partData)
      await updatePartFromXml(id, xml)
    } catch (error) {
      console.error('Failed to update part:', error)
      throw error
    }
  }

  /**
   * 부품 삭제
   */
  const deletePart = async (id: string): Promise<void> => {
    try {
      await api.delete(`/parts/${id}`)
    } catch (error) {
      console.error('Failed to delete part:', error)
      throw error
    }
  }

  /**
   * XML 파일 다운로드
   */
  const downloadPartXml = async (id: string, filename?: string): Promise<void> => {
    try {
      const xml = await fetchPartXml(id)
      const blob = new Blob([xml], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `part-${id}.xml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download part XML:', error)
      throw error
    }
  }

  /**
   * XML 파일 가져오기 (Import)
   */
  const importPartXml = async (file: File): Promise<{ id: string; partNumber: string }> => {
    try {
      const xml = await file.text()
      return await createPartFromXml(xml)
    } catch (error) {
      console.error('Failed to import part XML:', error)
      throw error
    }
  }

  /**
   * 카테고리별 부품 검색
   */
  const searchPartsByCategory = async (category: string): Promise<PartListItem[]> => {
    try {
      const data = await api.get<PartListItem[]>(`/parts/search?category=${encodeURIComponent(category)}`)
      return data
    } catch (error) {
      console.error('Failed to search parts by category:', error)
      throw error
    }
  }

  /**
   * 부품 번호로 검색
   */
  const searchPartByNumber = async (partNumber: string): Promise<PartListItem | null> => {
    try {
      const data = await api.get<PartListItem>(`/parts/search?partNumber=${encodeURIComponent(partNumber)}`)
      return data
    } catch (error) {
      console.error('Failed to search part by number:', error)
      throw error
    }
  }

  /**
   * XML 유효성 검증
   */
  const validateXml = (xml: string): { valid: boolean; errors?: string[] } => {
    return partXmlConverter.validate(xml)
  }

  /**
   * 샘플 XML 생성
   */
  const generateSampleXml = (): string => {
    const samplePart: PartData = {
      metadata: {
        id: '',
        partNumber: 'MCB-3P-50A',
        name: '배선용 차단기',
        description: '3극 50A 누전차단기',
        category: '차단기',
        manufacturer: 'LS산전',
        version: '1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['차단기', '배선용', '3극'],
      },
      symbol: {
        type: 'standard.Rectangle',
        size: { width: 80, height: 60 },
        attrs: {
          body: {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2,
          },
          label: {
            text: 'MCB',
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#000000',
          },
        },
        ports: {
          groups: {
            in: { position: 'top' },
            out: { position: 'bottom' },
          },
          items: [
            { id: 'L1', group: 'in' },
            { id: 'L2', group: 'in' },
            { id: 'L3', group: 'in' },
            { id: 'T1', group: 'out' },
            { id: 'T2', group: 'out' },
            { id: 'T3', group: 'out' },
          ],
        },
      },
      electricalSpecs: {
        voltage: {
          rated: '220V AC',
          range: { min: '200V', max: '240V' },
          type: 'AC',
        },
        current: {
          rated: '50A',
          range: { min: '0A', max: '50A' },
          type: 'AC',
        },
        power: {
          rated: '11kW',
        },
        frequency: {
          rated: '60Hz',
        },
        protectionClass: 'IP20',
      },
      physicalSpecs: {
        dimensions: {
          width: 54,
          height: 90,
          depth: 75,
          unit: 'mm',
        },
        weight: {
          value: 250,
          unit: 'g',
        },
        mountingType: 'DIN Rail',
        terminals: {
          count: 6,
          type: 'Screw',
          size: 'M4',
        },
      },
      certifications: {
        certifications: ['KC', 'CE'],
        standards: ['IEC 60947-2', 'KEC'],
        rohs: true,
      },
    }

    return partXmlConverter.toXML(samplePart)
  }

  return {
    fetchPartsList,
    fetchPartXml,
    fetchPart,
    createPart,
    createPartFromXml,
    updatePart,
    updatePartFromXml,
    deletePart,
    downloadPartXml,
    importPartXml,
    searchPartsByCategory,
    searchPartByNumber,
    validateXml,
    generateSampleXml,
  }
}
