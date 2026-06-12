import * as migration_20260606_163641 from './20260606_163641';
import * as migration_20260608_add_menu_items from './20260608_add_menu_items';
import * as migration_20260608_menu_items_column_meta from './20260608_menu_items_column_meta';
import * as migration_20260608_menu_items_cta from './20260608_menu_items_cta';
import * as migration_20260610_155557 from './20260610_155557';
import * as migration_20260611_101221 from './20260611_101221';
import * as migration_20260611_110058 from './20260611_110058';
import * as migration_20260611_151800 from './20260611_151800';
import * as migration_20260611_170000 from './20260611_170000';
import * as migration_20260612_aio_snippet from './20260612_aio_snippet';
import * as migration_20260612_add_title_emphasis from './20260612_add_title_emphasis';

export const migrations = [
  {
    up: migration_20260606_163641.up,
    down: migration_20260606_163641.down,
    name: '20260606_163641',
  },
  {
    up: migration_20260608_add_menu_items.up,
    down: migration_20260608_add_menu_items.down,
    name: '20260608_add_menu_items',
  },
  {
    up: migration_20260608_menu_items_column_meta.up,
    down: migration_20260608_menu_items_column_meta.down,
    name: '20260608_menu_items_column_meta',
  },
  {
    up: migration_20260608_menu_items_cta.up,
    down: migration_20260608_menu_items_cta.down,
    name: '20260608_menu_items_cta',
  },
  {
    up: migration_20260610_155557.up,
    down: migration_20260610_155557.down,
    name: '20260610_155557',
  },
  {
    up: migration_20260611_101221.up,
    down: migration_20260611_101221.down,
    name: '20260611_101221',
  },
  {
    up: migration_20260611_110058.up,
    down: migration_20260611_110058.down,
    name: '20260611_110058',
  },
  {
    up: migration_20260611_151800.up,
    down: migration_20260611_151800.down,
    name: '20260611_151800',
  },
  {
    up: migration_20260611_170000.up,
    down: migration_20260611_170000.down,
    name: '20260611_170000',
  },
  {
    up: migration_20260612_aio_snippet.up,
    down: migration_20260612_aio_snippet.down,
    name: '20260612_aio_snippet',
  },
  {
    up: migration_20260612_add_title_emphasis.up,
    down: migration_20260612_add_title_emphasis.down,
    name: '20260612_add_title_emphasis',
  },
];
