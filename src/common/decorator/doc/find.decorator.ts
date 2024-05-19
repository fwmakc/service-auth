import { applyDecorators } from '@nestjs/common';
import { DocBaseDecorator } from '@src/common/decorator/doc/base.decorator';

export const DocFindDecorator = (classDto) => {
  return applyDecorators(
    DocBaseDecorator({
      title: 'Найти все записи',
      models: [classDto],
      success: [classDto],
      queries: [
        {
          name: 'where',
          description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
          type: classDto.name,
          example: { id: 1 },
        },
        {
          name: 'order',
          description: 'Объект с полями записи и значением ASC/DESC, для сортировки записей по этим полям',
          example: { id: 'DESC' },
        },
        {
          name: 'relations',
          description: 'Массив объектов с нужными связями',
          type: '[RelationsDto]',
          example: [{ name: 'table', order: 'id', desc: true }],
        },
      ],
    })
  );
};
