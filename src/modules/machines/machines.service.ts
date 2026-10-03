import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, MachineRecord } from '../database/database.service';

@Injectable()
export class MachinesService {
  constructor(private readonly dbService: DatabaseService) {}

  getAll(): MachineRecord[] {
    return this.dbService.getMachines();
  }

  getGroupedByTech(): Record<string, string[]> {
    const list = this.dbService.getMachines().filter(m => m.isActive !== false);
    const map: Record<string, string[]> = {};
    for (const m of list) {
      if (!map[m.tech]) {
        map[m.tech] = [];
      }
      if (!map[m.tech].includes(m.name)) {
        map[m.tech].push(m.name);
      }
    }
    return map;
  }

  addMachine(tech: string, name: string, code?: string, note?: string): MachineRecord {
    const existing = this.dbService.getMachines().find(
      m => m.tech === tech && m.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      existing.isActive = true;
      this.dbService.saveMachines();
      return existing;
    }
    const newRecord: MachineRecord = {
      id: uuidv4(),
      tech: tech.trim(),
      name: name.trim(),
      code: code?.trim(),
      note: note?.trim(),
      isActive: true,
    };
    this.dbService.addMachine(newRecord);
    return newRecord;
  }

  updateMachine(id: string, updates: Partial<MachineRecord>): MachineRecord {
    const updated = this.dbService.updateMachine(id, updates);
    if (!updated) {
      throw new NotFoundException(`Máy ID '${id}' không tồn tại.`);
    }
    return updated;
  }

  deleteMachine(id: string): { success: boolean } {
    const deleted = this.dbService.deleteMachine(id);
    if (!deleted) {
      throw new NotFoundException(`Máy ID '${id}' không tồn tại.`);
    }
    return { success: true };
  }
}
