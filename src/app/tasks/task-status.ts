//Los estados posibles de una tarea son: pendiente, en progreso y completada.
export type TaskStatus = 'pending' | 'in-progress' | 'done';

export function statusLabel(status:TaskStatus):string{
    if (status === 'pending') return 'Pendiente';
    if (status === 'in-progress') return 'En curso';
    return 'Hecha';
}

export function columOf(status:TaskStatus):string{
    switch(status){
        case 'pending': return 'Pendientes';
        case 'in-progress': return 'En curso';
        case 'done': return 'Hechas';
        default: const check:never = status; return check;
    }
}

export function nextStatus(status:TaskStatus):TaskStatus{
    switch(status){
        case 'pending': return 'in-progress';
        case 'in-progress': return 'done';
        case 'done': return 'pending';
        default: const check:never = status; return check;
    }
}
