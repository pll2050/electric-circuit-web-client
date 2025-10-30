/**
 * 전기 부품 XML 스키마 정의
 *
 * XML 구조:
 * <part>
 *   <metadata>...</metadata>
 *   <symbol>...</symbol>
 *   <specifications>...</specifications>
 *   <model3d>...</model3d>
 * </part>
 */

// 부품 메타데이터
export interface PartMetadata {
  id: string
  partNumber: string
  name: string
  description?: string
  category: string
  manufacturer: string
  version: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

// JointJS 심볼 정의
export interface PartSymbol {
  // JointJS shape 타입 (예: 'standard.Rectangle', 'custom.Resistor')
  type: string

  // 심볼 크기
  size: {
    width: number
    height: number
  }

  // 심볼 속성
  attrs: {
    [key: string]: any
  }

  // 포트 정의 (연결점)
  ports?: {
    groups?: {
      [groupName: string]: {
        position?: string | object
        attrs?: object
        label?: object
      }
    }
    items?: Array<{
      id: string
      group: string
      args?: object
      label?: {
        text?: string
        position?: object
      }
      attrs?: object
    }>
  }

  // 커스텀 마크업 (SVG)
  markup?: string | Array<{
    tagName: string
    selector?: string
    attributes?: object
    children?: any[]
  }>
}

// 전기적 사양
export interface ElectricalSpecifications {
  // 전압 정보
  voltage?: {
    rated?: string        // 정격전압 (예: "220V AC")
    range?: {             // 전압 범위
      min: string
      max: string
    }
    type?: string         // AC/DC
  }

  // 전류 정보
  current?: {
    rated?: string        // 정격전류 (예: "50A")
    range?: {
      min: string
      max: string
    }
    type?: string         // AC/DC
  }

  // 전력 정보
  power?: {
    rated?: string        // 정격전력 (예: "11kW")
    max?: string
  }

  // 주파수
  frequency?: {
    rated?: string        // 정격주파수 (예: "60Hz")
    range?: {
      min: string
      max: string
    }
  }

  // 절연 저항
  insulationResistance?: string

  // 내전압
  withstandVoltage?: string

  // 보호 등급
  protectionClass?: string  // IP 등급 (예: "IP65")

  // 기타 전기적 특성
  custom?: {
    [key: string]: string | number
  }
}

// 물리적 사양
export interface PhysicalSpecifications {
  // 치수
  dimensions?: {
    width: number
    height: number
    depth: number
    unit: string          // mm, cm, inch
  }

  // 무게
  weight?: {
    value: number
    unit: string          // kg, g, lb
  }

  // 재질
  material?: {
    body?: string
    terminal?: string
    contact?: string
  }

  // 색상
  color?: string

  // 설치 방식
  mountingType?: string   // DIN Rail, Panel Mount, PCB Mount 등

  // 단자 정보
  terminals?: {
    count: number
    type?: string         // Screw, Spring, Plug-in 등
    size?: string
  }

  // 동작 환경
  operatingConditions?: {
    temperature?: {
      min: string
      max: string
    }
    humidity?: {
      min: string
      max: string
    }
    altitude?: string
  }
}

// 인증 및 표준
export interface CertificationsAndStandards {
  certifications?: string[]  // UL, CE, KC, CSA 등
  standards?: string[]       // IEC, KEC, NEMA 등
  rohs?: boolean            // RoHS 준수 여부
}

// 3D 모델 데이터
export interface Model3D {
  // 3D 모델 포맷
  format: 'gltf' | 'glb' | 'obj' | 'step' | 'iges' | 'stl'

  // 3D 모델 데이터 (Base64 인코딩 또는 URL)
  data?: string
  url?: string

  // 모델 메타데이터
  metadata?: {
    vertices?: number
    faces?: number
    fileSize?: number
    unit?: string         // mm, cm, m
  }

  // 변환 정보
  transform?: {
    position?: { x: number; y: number; z: number }
    rotation?: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  }

  // 재질 정보
  materials?: Array<{
    name: string
    color?: string
    metalness?: number
    roughness?: number
    texture?: string
  }>

  // 미리보기 이미지
  thumbnail?: string      // Base64 또는 URL
}

// 부품 문서
export interface PartDocumentation {
  datasheet?: {
    url?: string
    data?: string         // Base64 PDF
  }
  manual?: {
    url?: string
    data?: string
  }
  drawings?: Array<{
    name: string
    url?: string
    data?: string
  }>
  certificates?: Array<{
    name: string
    type: string
    url?: string
    data?: string
  }>
}

// 재고 및 가격 정보
export interface InventoryAndPricing {
  stock?: number
  minStock?: number
  price?: number
  currency?: string
  supplier?: {
    name?: string
    partNumber?: string
    url?: string
  }
}

// 전체 부품 데이터 구조
export interface PartData {
  metadata: PartMetadata
  symbol: PartSymbol
  electricalSpecs?: ElectricalSpecifications
  physicalSpecs?: PhysicalSpecifications
  certifications?: CertificationsAndStandards
  model3d?: Model3D
  documentation?: PartDocumentation
  inventory?: InventoryAndPricing
}

// XML 변환 유틸리티 타입
export interface PartXML {
  toXML(data: PartData): string
  fromXML(xml: string): PartData
  validate(xml: string): { valid: boolean; errors?: string[] }
}
