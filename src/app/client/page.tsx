import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import RequestForm from './RequestForm';

const prisma = new PrismaClient();

async function createRequest(formData: FormData) {
  'use server';
  
  const equipmentId = formData.get('equipmentId') as string;
  const description = formData.get('description') as string;

  if (equipmentId && description) {
    await prisma.repairRequest.create({
      data: {
        equipmentId,
        description,
        status: 'PENDING'
      }
    });
    revalidatePath('/client');
  }
}

export const instant = false;

export default async function ClientPage() {
  const equipments = await prisma.equipment.findMany({
    include: { facility: true }
  });

  const recentRequests = await prisma.repairRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { equipment: true }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Оставить заявку на ремонт</h1>
          <RequestForm equipments={equipments} createRequestAction={createRequest} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Статус последних заявок</h2>
          <div className="space-y-4">
            {recentRequests.map(req => (
              <div key={req.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900">{req.equipment.name}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {req.status === 'PENDING' ? 'ОЖИДАЕТ' : req.status === 'IN_PROGRESS' ? 'В РАБОТЕ' : 'ЗАВЕРШЕНО'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{req.description}</p>
              </div>
            ))}
            {recentRequests.length === 0 && (
              <p className="text-sm text-gray-500">Заявок пока нет.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
