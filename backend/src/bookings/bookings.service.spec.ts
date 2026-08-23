import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookingsService', () => {
  let service: BookingsService;

  const prismaMock = {
    service: {
      findUnique: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const startTime = new Date('2026-08-27T09:00:00.000Z');

    it('should create a booking successfully', async () => {
      const serviceData = {
        id: 1,
        name: 'Haircut',
        duration: 60,
      };

      const createdBooking = {
        id: 'booking-1',
        customerName: 'Ziel',
        customerEmail: 'ziel@example.com',
        serviceId: 1,
        startTime,
        endTime: new Date('2026-08-27T10:00:00.000Z'),
        status: 'PENDING',
        service: serviceData,
      };

      prismaMock.service.findUnique.mockResolvedValue(serviceData);
      prismaMock.booking.findFirst.mockResolvedValue(null);
      prismaMock.booking.create.mockResolvedValue(createdBooking);

      const result = await service.create({
        customerName: 'Ziel',
        customerEmail: 'ziel@example.com',
        serviceId: 1,
        startTime,
      });

      expect(result).toEqual(createdBooking);

      expect(prismaMock.booking.create).toHaveBeenCalled();
    });

    it('should throw when the service does not exist', async () => {
      prismaMock.service.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          customerName: 'Ziel',
          customerEmail: 'ziel@example.com',
          serviceId: 999,
          startTime,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.booking.create).not.toHaveBeenCalled();
    });

    it('should reject an overlapping booking', async () => {
      const serviceData = {
        id: 1,
        name: 'Haircut',
        duration: 60,
      };

      prismaMock.service.findUnique.mockResolvedValue(serviceData);

      prismaMock.booking.findFirst.mockResolvedValue({
        id: 'existing-booking',
        startTime: new Date('2026-08-27T09:30:00.000Z'),
        endTime: new Date('2026-08-27T10:30:00.000Z'),
        status: 'PENDING',
      });

      await expect(
        service.create({
          customerName: 'Ziel',
          customerEmail: 'ziel@example.com',
          serviceId: 1,
          startTime,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.booking.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a booking when it exists', async () => {
      const booking = {
        id: 'booking-1',
        customerName: 'Ziel',
        service: {
          id: 1,
          name: 'Haircut',
          duration: 60,
        },
      };

      prismaMock.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne('booking-1');

      expect(result).toEqual(booking);
    });

    it('should throw when the booking does not exist', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('missing-booking'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});