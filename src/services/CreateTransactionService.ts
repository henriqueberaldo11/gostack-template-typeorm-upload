import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('This type of transaction is not allowed');
    }

    const transactionsRepository = getCustomRepository(TransactionRepository);
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError(
        'Exit not allowed, informed value greater than the total available',
      );
    }

    const createCategoryService = new CreateCategoryService();

    const { id } = await createCategoryService.execute({ title: category });
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
