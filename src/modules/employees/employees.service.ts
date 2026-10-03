import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, EmployeeRecord } from '../database/database.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly dbService: DatabaseService) {}

  getAll(search?: string, dept?: string): EmployeeRecord[] {
    let list = this.dbService.getEmployees();
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        e => (e.name && e.name.toLowerCase().includes(q)) || (e.mnv && e.mnv.toLowerCase().includes(q))
      );
    }
    if (dept && dept !== 'ALL') {
      list = list.filter(e => e.dept === dept);
    }
    return list;
  }

  getHierarchy() {
    const list = this.dbService.getEmployees();
    const depts: Record<string, Record<string, EmployeeRecord[]>> = {};

    for (const emp of list) {
      const d = emp.dept || 'Khác';
      const a = emp.area || d;
      if (!depts[d]) depts[d] = {};
      if (!depts[d][a]) depts[d][a] = [];
      depts[d][a].push(emp);
    }

    return depts;
  }

  create(body: { mnv?: string; name: string; dept?: string; area?: string; role?: string }): EmployeeRecord {
    const newEmp: EmployeeRecord = {
      id: uuidv4(),
      mnv: body.mnv?.trim() || '',
      name: body.name.trim(),
      dept: body.dept?.trim() || 'Sản Xuất',
      area: body.area?.trim() || body.dept?.trim() || 'General',
      role: body.role?.trim() || 'Staff',
    };
    this.dbService.addEmployee(newEmp);
    return newEmp;
  }

  update(id: string, updates: Partial<EmployeeRecord>): EmployeeRecord {
    const updated = this.dbService.updateEmployee(id, updates);
    if (!updated) {
      throw new NotFoundException(`Nhân viên ID '${id}' không tồn tại.`);
    }
    return updated;
  }

  delete(id: string): { success: boolean } {
    const deleted = this.dbService.deleteEmployee(id);
    if (!deleted) {
      throw new NotFoundException(`Nhân viên ID '${id}' không tồn tại.`);
    }
    return { success: true };
  }

  bulkImport(list: Array<{ name: string; mnv?: string; dept?: string; area?: string; role?: string }>): { count: number } {
    if (!Array.isArray(list)) return { count: 0 };
    let imported = 0;
    const current = [...this.dbService.getEmployees()];

    for (const item of list) {
      if (!item.name || !item.name.trim()) continue;
      const mnv = item.mnv ? item.mnv.trim() : '';
      const name = item.name.trim();

      // Check if employee with same MNV or Name exists
      const idx = current.findIndex(
        e => (mnv && e.mnv && e.mnv.toLowerCase() === mnv.toLowerCase()) ||
             (!mnv && e.name.toLowerCase() === name.toLowerCase())
      );

      if (idx !== -1) {
        current[idx] = {
          ...current[idx],
          name,
          dept: item.dept?.trim() || current[idx].dept,
          area: item.area?.trim() || current[idx].area,
          role: item.role?.trim() || current[idx].role,
        };
      } else {
        current.push({
          id: uuidv4(),
          mnv,
          name,
          dept: item.dept?.trim() || 'Khác',
          area: item.area?.trim() || item.dept?.trim() || 'Khác',
          role: item.role?.trim() || 'Staff',
        });
      }
      imported++;
    }

    this.dbService.setEmployees(current);
    return { count: imported };
  }
}
