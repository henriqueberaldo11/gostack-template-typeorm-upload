import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: RequestDTO): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title },
    });

    if (!checkCategoryExists) {
      const category = categoryRepository.create({ title });

      await categoryRepository.save(category);

      return category;
    }

    return checkCategoryExists;
  }
}

export default CreateCategoryService;
