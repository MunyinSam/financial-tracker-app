import { Request, Response } from 'express';
import { PersonService } from '../services/person.service';

export class PersonController {
	static async getAll(req: Request, res: Response) {
		try {
			const persons = await PersonService.getAllPersons();
			res.json({
				success: true,
				data: persons,
			});
		} catch (error: any) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async getById(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			const person = await PersonService.getPersonById(id);

			res.json({
				success: true,
				data: person,
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async create(req: Request, res: Response) {
		try {
			const person = await PersonService.createPerson(req.body);

			res.status(201).json({
				success: true,
				data: person,
				message: 'Person created successfully',
			});
		} catch (error: any) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async update(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			const person = await PersonService.updatePerson(id, req.body);

			res.json({
				success: true,
				data: person,
				message: 'Person updated successfully',
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 400;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			await PersonService.deletePerson(id);

			res.json({
				success: true,
				message: 'Person deleted successfully',
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}
}
