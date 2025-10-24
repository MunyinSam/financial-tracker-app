import { PersonModel } from '../models/person.model';
import { Person, CreatePersonDTO } from '../types';

export class PersonService {
	static async getAllPersons(): Promise<Person[]> {
		return await PersonModel.findAll();
	}

	static async getPersonById(id: number): Promise<Person> {
		if (!id || id <= 0) {
			throw new Error('Invalid person ID');
		}

		const person = await PersonModel.findById(id);

		if (!person) {
			throw new Error('Person not found');
		}

		return person;
	}

	static async createPerson(data: CreatePersonDTO): Promise<Person> {
		// Validation
		if (!data.FName || data.FName.trim().length === 0) {
			throw new Error('First name is required');
		}

		if (!data.LName || data.LName.trim().length === 0) {
			throw new Error('Last name is required');
		}

		if (data.FName.length > 100) {
			throw new Error('First name must be less than 100 characters');
		}

		if (data.LName.length > 100) {
			throw new Error('Last name must be less than 100 characters');
		}

		// Validate date of birth if provided
		if (data.DateOfBirth) {
			const dob = new Date(data.DateOfBirth);
			const today = new Date();

			if (dob > today) {
				throw new Error('Date of birth cannot be in the future');
			}

			// Check if person is at least 18 years old
			const age = today.getFullYear() - dob.getFullYear();
			if (age < 18) {
				throw new Error('Person must be at least 18 years old');
			}
		}

		return await PersonModel.create(data);
	}

	static async updatePerson(
		id: number,
		data: Partial<CreatePersonDTO>
	): Promise<Person> {
		// Check if person exists
		await this.getPersonById(id);

		// Validation
		if (data.FName !== undefined && data.FName.trim().length === 0) {
			throw new Error('First name cannot be empty');
		}

		if (data.LName !== undefined && data.LName.trim().length === 0) {
			throw new Error('Last name cannot be empty');
		}

		const updated = await PersonModel.update(id, data);

		if (!updated) {
			throw new Error('Failed to update person');
		}

		return updated;
	}

	static async deletePerson(id: number): Promise<void> {
		// Check if person exists
		await this.getPersonById(id);

		const deleted = await PersonModel.delete(id);

		if (!deleted) {
			throw new Error('Failed to delete person');
		}
	}
}
