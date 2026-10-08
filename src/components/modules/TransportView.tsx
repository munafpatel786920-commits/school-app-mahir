import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Vehicle } from '../../types';
import { formatCurrency } from '../../utils/translations';
import { Modal } from '../common/Modal';
import { Bus, Plus, Phone, Users, MapPin, Edit, Trash2 } from 'lucide-react';

export const TransportView: React.FC = () => {
  const { vehicles, students, addVehicle, updateVehicle, deleteVehicle } = useSchool();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const initialForm: Omit<Vehicle, 'id'> = {
    vehicleNumber: 'GJ-16-AZ-9900',
    driverName: '',
    driverMobile: '',
    route: 'Route 1: Ikhar Village -> Main Road -> School',
    capacity: 35,
    transportFee: 1000,
    assignedStudentsCount: 20
  };

  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>(initialForm);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({
      vehicleNumber: v.vehicleNumber,
      driverName: v.driverName,
      driverMobile: v.driverMobile,
      route: v.route,
      capacity: v.capacity,
      transportFee: v.transportFee,
      assignedStudentsCount: v.assignedStudentsCount
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleNumber.trim() || !formData.driverName.trim()) return;

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, formData);
    } else {
      addVehicle(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bus className="w-6 h-6 text-emerald-600" />
            <span>School Bus & Transport Logistics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fleet vehicle tracking, driver contacts, commuter pickup routes & monthly fare
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Vehicles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {vehicles.map((v) => {
          const occupancyRate = Math.round((v.assignedStudentsCount / v.capacity) * 100);

          return (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                    <Bus className="w-5 h-5" />
                  </div>
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-800 border border-slate-200">
                    {v.vehicleNumber}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-1">{v.route}</h3>

                <div className="space-y-2 mt-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver Name:</span>
                    <strong className="text-slate-800">{v.driverName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver Mobile:</span>
                    <span className="font-mono text-emerald-700 font-bold">{v.driverMobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Fare:</span>
                    <strong className="text-slate-900">{formatCurrency(v.transportFee)}</strong>
                  </div>
                </div>

                {/* Capacity Occupancy Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Assigned Students</span>
                    <span>
                      {v.assignedStudentsCount} / {v.capacity} Seats ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyRate >= 90 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occupancyRate)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(v)}
                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteVehicle(v.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? 'Edit Vehicle' : 'Register Transport Vehicle'}
        subtitle="Driver details, seating capacity & route assignment"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vehicle Plate Number</label>
            <input
              type="text"
              required
              placeholder="e.g. GJ-16-AZ-4210"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Driver Name</label>
              <input
                type="text"
                required
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Driver Mobile</label>
              <input
                type="tel"
                required
                value={formData.driverMobile}
                onChange={(e) => setFormData({ ...formData, driverMobile: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Seating Capacity</label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Fee (₹)</label>
              <input
                type="number"
                required
                value={formData.transportFee}
                onChange={(e) => setFormData({ ...formData, transportFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Route Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Route 2: Amod -> Achhod -> Ikhar School"
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
