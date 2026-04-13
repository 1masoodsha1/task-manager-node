import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TaskStatus {
TODO = "TODO",
IN_PROGRESS = "IN_PROGRESS",
DONE = "DONE",
}

@Entity({ name: "tasks" })
export class Task {
@PrimaryGeneratedColumn()
id!: number;

@Column({ length: 255 })
title!: string;

@Column({ type: "text", nullable: true })
description!: string | null;

@Column({ type: "text", default: TaskStatus.TODO })
status!: TaskStatus;

@Column({ type: "datetime", nullable: true })
dueDate!: Date | null;
}