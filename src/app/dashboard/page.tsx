import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const instant = false;

async function assignTechnician(formData: FormData) {
  'use server';
  
  const requestId = formData.get('requestId') as string;
  const technicianId = formData.get('technicianId') as string;

  if (requestId && technicianId) {
    await prisma.repairRequest.update({
      where: { id: requestId },
      data: {
        technicianId,
        status: 'IN_PROGRESS'
      }
    });
    revalidatePath('/dashboard');
  }
}

import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    redirect('/login');
  }

  const requests = await prisma.repairRequest.findMany({
    include: {
      equipment: {
        include: { facility: true }
      },
      technician: true
    }
  });

  const technicians = await prisma.user.findMany({
    where: { role: 'TECHNICIAN' }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Панель диспетчера</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Учреждение</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оборудование</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Специалист</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.equipment.facility.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.equipment.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{req.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {req.status === 'PENDING' ? 'ОЖИДАЕТ' : req.status === 'IN_PROGRESS' ? 'В РАБОТЕ' : 'ЗАВЕРШЕНО'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <form action={assignTechnician} className="flex gap-2">
                      <input type="hidden" name="requestId" value={req.id} />
                      <select
                        name="technicianId"
                        defaultValue={req.technicianId || ""}
                        className="block w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border"
                        required
                      >
                        <option value="">Назначить специалиста...</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name || 'Специалист'}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-indigo-700"
                      >
                        {req.technician ? 'Переназначить' : 'Назначить'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Заявок на ремонт пока нет.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
