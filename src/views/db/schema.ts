/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/23
 */

export default {
  'name': 'articles',
  'version': 0,
  'description': 'articles schema of hamter.',
  'type': 'object',
  'properties': {
    'article_name': {
      'type': 'string'
    },
    'article_path': {
      'type': 'string',
      'primary': true
    },
    'article_description': {
      'type': 'string'
    },
    'categories': {
      'type': 'array',
      'uniqueItems': true,
      'item': {
        'type': 'object',
        'properties': {
          'category_name': {
            'type': 'string'
          },
          'category_id': {
            'type': 'string'
          }
        }
      }
    },
    'create_time': {
      'type': 'number',
      'index': true
    }
  },
  compoundIndex: [
    ['create_time', '_id']
  ],
  'required': ['article_name', 'create_time']
};
