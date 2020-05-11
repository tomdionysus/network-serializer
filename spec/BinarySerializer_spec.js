/* eslint-env jasmine */

const BinarySerializer = require('../lib/BinarySerializer')

describe('BinarySerializer', () => {
  var x1

  beforeEach(() => {
    x1 = new BinarySerializer()
  })

  it('should allow New', () => {
    var x2 = new BinarySerializer()

    expect(x1).not.toBe(x2)
  })

  describe('_reallocate', () => {
    it('should reallocate and copy buffer', () => {
      var x1 = new BinarySerializer({ buffer: Buffer.from([5, 10, 15, 20]) })

      x1._reallocate(15)

      expect(x1.buffer.length).toEqual(15)
      expect([...x1.buffer]).toEqual([5, 10, 15, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })

    it('should not reallocate if new size is == current size', () => {
      var x1 = new BinarySerializer({ buffer: Buffer.from([5, 10, 15, 20]) })

      x1._reallocate(4)

      expect(x1.buffer.length).toEqual(4)
      expect([...x1.buffer]).toEqual([5, 10, 15, 20])
    })

    it('should not reallocate if new size is < current size', () => {
      var x1 = new BinarySerializer({ buffer: Buffer.from([5, 10, 15, 20]) })

      x1._reallocate(3)

      expect(x1.buffer.length).toEqual(4)
      expect([...x1.buffer]).toEqual([5, 10, 15, 20])
    })
  })

  describe('_ensureHeadroom', () => {
    it('should reallocate a multiple of chunkSize and copy buffer', () => {
      var x1 = new BinarySerializer({ buffer: Buffer.from([5, 10, 15, 20]), offset: 4, chunkSize: 20 })

      x1._ensureHeadroom(6)

      expect(x1.buffer.length).toEqual(20)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, 4)]).toEqual([5, 10, 15, 20])
    })
  })

  describe('write', () => {
    it('should write with utf8 encoding, updating offset and length', () => {
      x1.write('Hello Wōrld', 'utf8')

      expect(x1.offset).toEqual(12)
      expect(x1.length).toEqual(12)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([72, 101, 108, 108, 111, 32, 87, 197, 141, 114, 108, 100])
    })

    it('should write with hex encoding, updating offset and length', () => {
      x1.write('DEADBEEF', 'hex')

      expect(x1.offset).toEqual(4)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0xDE, 0xAD, 0xBE, 0xEF])
    })
  })

  describe('writeBytes', () => {
    it('should write bytes with offset and length', () => {
      x1.writeBytes(Buffer.from([1, 2, 3, 4, 5, 6]), 2, 2)

      expect(x1.offset).toEqual(2)
      expect(x1.length).toEqual(2)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([3, 4])
    })

    it('should write bytes for entire buffer', () => {
      x1.writeBytes(Buffer.from([1, 2, 3, 4, 5, 6]))

      expect(x1.offset).toEqual(6)
      expect(x1.length).toEqual(6)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([1, 2, 3, 4, 5, 6])
    })
  })

  describe('writeDouble', () => {
    it('should write double little endian, updating offset and length', () => {
      x1.writeDouble(3.14279)

      expect(x1.offset).toEqual(8)
      expect(x1.length).toEqual(8)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([21, 145, 97, 21, 111, 36, 9, 64])
    })

    it('should write double big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeDouble(3.14279)

      expect(x1.offset).toEqual(8)
      expect(x1.length).toEqual(8)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([64, 9, 36, 111, 21, 97, 145, 21])
    })
  })

  describe('writeFloat', () => {
    it('should write float little endian, updating offset and length', () => {
      x1.writeFloat(0.25)

      expect(x1.offset).toEqual(4)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0, 0, 128, 62])
    })

    it('should write float big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeFloat(0.25)

      expect(x1.offset).toEqual(4)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([62, 128, 0, 0])
    })
  })

  describe('writeBigInt64', () => {
    it('should write BigInt64 little endian, updating offset and length', () => {
      x1.writeBigInt64(0x1234567890123456n)

      expect(x1.offset).toEqual(8)
      expect(x1.length).toEqual(8)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([86, 52, 18, 144, 120, 86, 52, 18])
    })

    it('should write BigInt64 big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeBigInt64(0x1234567890123456n)

      expect(x1.offset).toEqual(8)
      expect(x1.length).toEqual(8)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([18, 52, 86, 120, 144, 18, 52, 86])
    })
  })

  describe('writeInt32', () => {
    it('should write Int32 little endian, updating offset and length', () => {
      x1.writeInt32(0x12345678)

      expect(x1.offset).toEqual(4)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x78, 0x56, 0x34, 0x12])
    })

    it('should write Int32 big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeInt32(0x12345678)

      expect(x1.offset).toEqual(4)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x12, 0x34, 0x56, 0x78])
    })
  })

  describe('writeInt16', () => {
    it('should write Int16 little endian, updating offset and length', () => {
      x1.writeInt16(0x1234)

      expect(x1.offset).toEqual(2)
      expect(x1.length).toEqual(2)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x34, 0x12])
    })

    it('should write Int16 big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeInt16(0x1234)

      expect(x1.offset).toEqual(2)
      expect(x1.length).toEqual(2)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x12, 0x34])
    })
  })

  describe('writeInt8', () => {
    it('should write Int8 little endian, updating offset and length', () => {
      x1.writeInt8(-7)

      expect(x1.offset).toEqual(1)
      expect(x1.length).toEqual(1)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([249])
    })
  })

  describe('writeBigUInt64', () => {
    it('should write BigUInt64 little endian, updating offset and length', () => {
      x1.writeBigUInt64(0x1234567890123456n)

      expect(x1.offset).toEqual(8)
      expect(x1.length).toEqual(8)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([86, 52, 18, 144, 120, 86, 52, 18])
    })

    it('should write BigUInt64 big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeBigUInt64(0x1234567890123456n)

      expect(x1.offset).toEqual(8)
      expect(x1.length).toEqual(8)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([18, 52, 86, 120, 144, 18, 52, 86])
    })
  })

  describe('writeUInt32', () => {
    it('should write UInt32 little endian, updating offset and length', () => {
      x1.writeUInt32(0x12345678)

      expect(x1.offset).toEqual(4)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x78, 0x56, 0x34, 0x12])
    })

    it('should write UInt32 big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeUInt32(0x12345678)

      expect(x1.offset).toEqual(4)
      expect(x1.length).toEqual(4)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x12, 0x34, 0x56, 0x78])
    })
  })

  describe('writeUInt16', () => {
    it('should write UInt16 little endian, updating offset and length', () => {
      x1.writeUInt16(0x1234)

      expect(x1.offset).toEqual(2)
      expect(x1.length).toEqual(2)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x34, 0x12])
    })

    it('should write UInt16 big endian, updating offset and length', () => {
      x1.bigEndian = true
      x1.writeUInt16(0x1234)

      expect(x1.offset).toEqual(2)
      expect(x1.length).toEqual(2)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([0x12, 0x34])
    })
  })

  describe('writeUInt8', () => {
    it('should write UInt8 little endian, updating offset and length', () => {
      x1.writeUInt8(21)

      expect(x1.offset).toEqual(1)
      expect(x1.length).toEqual(1)
      expect([...x1.buffer.slice(0, x1.length)]).toEqual([21])
    })
  })

  describe('releaseBuffer', () => {
    it('should supply correct buffer in little endian mode', () => {
      x1.writeUInt8(21)
      x1.writeUInt16(21)
      x1.writeInt32(-32472)
      x1.write('Next!', 'ascii')

      expect([...x1.releaseBuffer()]).toEqual([21, 21, 0, 40, 129, 255, 255, 78, 101, 120, 116, 33])
    })

    it('should supply correct buffer in big endian mode', () => {
      x1.bigEndian = true

      x1.writeUInt8(21)
      x1.writeUInt16(21)
      x1.writeInt32(-32472)
      x1.write('Next!', 'ascii')

      expect([...x1.releaseBuffer()]).toEqual([21, 0, 21, 255, 255, 129, 40, 78, 101, 120, 116, 33])
    })
  })

  describe('seek', () => {
    it('should seek by changing offset', () => {
      x1.writeUInt8(21)
      x1.writeUInt16(21)
      x1.writeInt32(-32472)
      x1.write('Next!', 'ascii')

      expect([...x1.releaseBuffer()]).toEqual([21, 21, 0, 40, 129, 255, 255, 78, 101, 120, 116, 33])

      x1.seek(4)

      x1.writeUInt32(0xFFFFFFFF)

      expect([...x1.releaseBuffer()]).toEqual([21, 21, 0, 40, 255, 255, 255, 255, 101, 120, 116, 33])
      expect(x1.offset).toEqual(8)
    })

    it('should limit seek to length', () => {
      x1.writeUInt8(21)
      x1.writeUInt16(21)
      x1.writeInt32(-32472)
      x1.write('Next!', 'ascii')

      expect(x1.offset).toEqual(12)
      x1.seek(200)
      expect(x1.offset).toEqual(12)
    })

    it('should limit seek to zero', () => {
      x1.writeUInt8(21)
      x1.writeUInt16(21)
      x1.writeInt32(-32472)
      x1.write('Next!', 'ascii')

      expect(x1.offset).toEqual(12)
      x1.seek(-5500)
      expect(x1.offset).toEqual(0)
    })
  })
})
