import { Test, TestingModule } from '@nestjs/testing';

import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ServicesService', () => {
  let service: ServicesService;

  const prismaMock = {
    service: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all services', async () => {
    const services = [
      {
        id: 1,
        name: 'Haircut',
        duration: 60,
      },
      {
        id: 2,
        name: 'Hair Coloring',
        duration: 120,
      },
    ];

    prismaMock.service.findMany.mockResolvedValue(services);

    const result = await service.findAll();

    expect(result).toEqual(services);
    expect(prismaMock.service.findMany).toHaveBeenCalledWith({
      orderBy: {
        id: 'asc',
      },
    });
  });
});