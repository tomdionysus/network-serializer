/* eslint-env jasmine */

const BinaryDeserializer = require('../lib/BinaryDeserializer')

describe('BinaryDeserializer', () => {
  var x1

  beforeEach(() => {
    x1 = new BinaryDeserializer()
  })

  it('should allow New', () => {
    var x2 = new BinaryDeserializer()

    expect(x1).not.toBe(x2)
  })

  describe('read', () => {
    it('should read with utf8 encoding, updating offset', () => {
      x1.buffer = Buffer.from([72, 101, 108, 108, 111, 32, 87, 197, 141, 114, 108, 100])
      expect(x1.read(12, 'utf8')).toEqual('Hello Wōrld')
      expect(x1.offset).toEqual(12)
    })

    it('should read with hex encoding, updating offset', () => {
      x1.buffer = Buffer.from([0xDE, 0xAD, 0xBE, 0xEF])
      expect(x1.read(4, 'hex')).toEqual('deadbeef')
      expect(x1.offset).toEqual(4)
    })
  })

  describe('readBytes', () => {
    it('should read bytes with offset', () => {
      x1.buffer = Buffer.from([1, 2, 3, 4, 5, 6])

      expect([...x1.readBytes(4)]).toEqual([1, 2, 3, 4])
      expect([...x1.readBytes(2)]).toEqual([5, 6])
      expect(x1.offset).toEqual(6)
    })
  })

  describe('readDouble', () => {
    it('should read double little endian, updating offset', () => {
      x1.buffer = Buffer.from([21, 145, 97, 21, 111, 36, 9, 64])
      expect(x1.readDouble()).toEqual(3.14279)
      expect(x1.offset).toEqual(8)
    })

    it('should read double big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([64, 9, 36, 111, 21, 97, 145, 21])
      expect(x1.readDouble()).toEqual(3.14279)
      expect(x1.offset).toEqual(8)
    })
  })

  describe('readFloat', () => {
    it('should read float little endian, updating offset', () => {
      x1.buffer = Buffer.from([0, 0, 128, 62])
      expect(x1.readFloat()).toEqual(0.25)
      expect(x1.offset).toEqual(4)
    })

    it('should read float big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([62, 128, 0, 0])
      expect(x1.readFloat()).toEqual(0.25)
      expect(x1.offset).toEqual(4)
    })
  })

  describe('readBigInt64', () => {
    it('should read BigInt64 little endian, updating offset', () => {
      x1.buffer = Buffer.from([86, 52, 18, 144, 120, 86, 52, 18])
      expect(x1.readBigInt64()).toEqual(0x1234567890123456n)
      expect(x1.offset).toEqual(8)
    })

    it('should read BigInt64 big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([18, 52, 86, 120, 144, 18, 52, 86])
      expect(x1.readBigInt64()).toEqual(0x1234567890123456n)
      expect(x1.offset).toEqual(8)
    })
  })

  describe('readInt32', () => {
    it('should read Int32 little endian, updating offset', () => {
      x1.buffer = Buffer.from([0x78, 0x56, 0x34, 0x12])
      expect(x1.readInt32()).toEqual(0x12345678)
      expect(x1.offset).toEqual(4)
    })

    it('should read Int32 big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([0x12, 0x34, 0x56, 0x78])
      expect(x1.readInt32()).toEqual(0x12345678)
      expect(x1.offset).toEqual(4)
    })
  })

  describe('readInt16', () => {
    it('should read Int16 little endian, updating offset', () => {
      x1.buffer = Buffer.from([0x34, 0x12])
      expect(x1.readInt16()).toEqual(0x1234)
      expect(x1.offset).toEqual(2)
    })

    it('should read Int16 big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([0x12, 0x34])
      expect(x1.readInt16()).toEqual(0x1234)
      expect(x1.offset).toEqual(2)
    })
  })

  describe('readInt8', () => {
    it('should read Int8 little endian, updating offset', () => {
      x1.buffer = Buffer.from([249])
      expect(x1.readInt8()).toEqual(-7)
      expect(x1.offset).toEqual(1)
    })
  })

  describe('readBigUInt64', () => {
    it('should read BigUInt64 little endian, updating offset', () => {
      x1.buffer = Buffer.from([86, 52, 18, 144, 120, 86, 52, 18])
      expect(x1.readBigUInt64()).toEqual(0x1234567890123456n)
      expect(x1.offset).toEqual(8)
    })

    it('should read BigUInt64 big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([18, 52, 86, 120, 144, 18, 52, 86])
      expect(x1.readBigUInt64()).toEqual(0x1234567890123456n)
      expect(x1.offset).toEqual(8)
    })
  })

  describe('readUInt32', () => {
    it('should read UInt32 little endian, updating offset', () => {
      x1.buffer = Buffer.from([0x78, 0x56, 0x34, 0x12])
      expect(x1.readUInt32()).toEqual(0x12345678)
      expect(x1.offset).toEqual(4)
    })

    it('should read UInt32 big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([0x12, 0x34, 0x56, 0x78])
      expect(x1.readUInt32()).toEqual(0x12345678)
      expect(x1.offset).toEqual(4)
    })
  })

  describe('readUInt16', () => {
    it('should read UInt16 little endian, updating offset', () => {
      x1.buffer = Buffer.from([0x34, 0x12])
      expect(x1.readUInt16()).toEqual(0x1234)
      expect(x1.offset).toEqual(2)
    })

    it('should read UInt16 big endian, updating offset', () => {
      x1.bigEndian = true
      x1.buffer = Buffer.from([0x12, 0x34])
      expect(x1.readUInt16()).toEqual(0x1234)
      expect(x1.offset).toEqual(2)
    })
  })

  describe('readUInt8', () => {
    it('should read UInt8 little endian, updating offset', () => {
      x1.buffer = Buffer.from([249])
      expect(x1.readUInt8()).toEqual(249)
      expect(x1.offset).toEqual(1)
    })
  })

  describe('seek', () => {
    it('should seek by changing offset', () => {
      x1.buffer = Buffer.from([86, 52, 18, 144, 120, 86, 52, 18])
      expect(x1.readBigUInt64()).toEqual(0x1234567890123456n)
      expect(x1.offset).toEqual(8)

      x1.seek(4)
      expect(x1.readUInt32()).toEqual(0x12345678)
      expect(x1.offset).toEqual(8)
    })

    it('should limit seek to length', () => {
      x1.buffer = Buffer.from([86, 52, 18, 144, 120, 86, 52, 18])
      expect(x1.readBigUInt64()).toEqual(0x1234567890123456n)
      expect(x1.offset).toEqual(8)

      x1.seek(144)
      expect(x1.offset).toEqual(8)
    })

    it('should limit seek to zero', () => {
      x1.buffer = Buffer.from([86, 52, 18, 144, 120, 86, 52, 18])
      expect(x1.readBigUInt64()).toEqual(0x1234567890123456n)
      expect(x1.offset).toEqual(8)

      x1.seek(-22)
      expect(x1.offset).toEqual(0)
    })
  })
})
