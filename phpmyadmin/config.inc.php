<?php

require '/etc/phpmyadmin/config.secret.inc.php';

/* Ensure we got the environment */
$vars = [
    'PMA_ARBITRARY',
    'PMA_HOST',
    'PMA_HOSTS',
    'PMA_VERBOSE',
    'PMA_VERBOSES',
    'PMA_PORT',
    'PMA_PORTS',
    'PMA_SOCKET',
    'PMA_SOCKETS',
    'PMA_USER',
    'PMA_PASSWORD',
    'PMA_ABSOLUTE_URI',
    'PMA_CONTROLHOST',
    'PMA_CONTROLPORT',
    'PMA_PMADB',
    'PMA_CONTROLUSER',
    'PMA_CONTROLPASS',
    'PMA_QUERYHISTORYDB',
    'PMA_QUERYHISTORYMAX',
    'MAX_EXECUTION_TIME',
    'MEMORY_LIMIT',
    'PMA_UPLOADDIR',
    'PMA_SAVEDIR',
    'PMA_SSL',
    'PMA_SSLS',
];

foreach ($vars as $var) {
    $env = getenv($var);
    if (!isset($_ENV[$var]) && $env !== false) {
        $_ENV[$var] = $env;
    }
}
if (isset($_ENV['PMA_QUERYHISTORYDB'])) {
    $cfg['QueryHistoryDB'] = (bool) $_ENV['PMA_QUERYHISTORYDB'];
}

if (isset($_ENV['PMA_QUERYHISTORYMAX'])) {
    $cfg['QueryHistoryMax'] = (int) $_ENV['PMA_QUERYHISTORYMAX'];
}

/* Arbitrary server connection */
if (isset($_ENV['PMA_ARBITRARY']) && $_ENV['PMA_ARBITRARY'] === '1') {
    $cfg['AllowArbitraryServer'] = true;
}

/* Play nice behind reverse proxys */
if (isset($_ENV['PMA_ABSOLUTE_URI'])) {
    $cfg['PmaAbsoluteUri'] = trim($_ENV['PMA_ABSOLUTE_URI']);
}

/* Figure out hosts */

/* Fallback to default linked */
$hosts = ['db'];

/* Set by environment */
if (! empty($_ENV['PMA_HOST'])) {
    $hosts = [$_ENV['PMA_HOST']];
    $verbose = [$_ENV['PMA_VERBOSE']];
    $ports = [$_ENV['PMA_PORT']];
    $ssls = [$_ENV['PMA_SSL']];
} elseif (! empty($_ENV['PMA_HOSTS'])) {
    $hosts = array_map('trim', explode(',', $_ENV['PMA_HOSTS']));
    $verbose = array_map('trim', explode(',', $_ENV['PMA_VERBOSES']));
    $ports = array_map('trim', explode(',', $_ENV['PMA_PORTS']));
    $ssls = array_map('trim', explode(',', $_ENV['PMA_SSLS']));
}

if (! empty($_ENV['PMA_SOCKET'])) {
    $sockets = [$_ENV['PMA_SOCKET']];
} elseif (! empty($_ENV['PMA_SOCKETS'])) {
    $sockets = explode(',', $_ENV['PMA_SOCKETS']);
}

/* Server settings */
for ($i = 1; isset($hosts[$i - 1]); $i++) {
    if (isset($ssls[$i - 1]) && $ssls[$i - 1] === '1') {
        $cfg['Servers'][$i]['ssl'] = $ssls[$i - 1];
    }
    $cfg['Servers'][$i]['host'] = $hosts[$i - 1];
    if (isset($verbose[$i - 1])) {
        $cfg['Servers'][$i]['verbose'] = $verbose[$i - 1];
    }
    if (isset($ports[$i - 1])) {
        $cfg['Servers'][$i]['port'] = $ports[$i - 1];
    }
    if (isset($_ENV['PMA_USER'])) {
        $cfg['Servers'][$i]['auth_type'] = 'config';
        $cfg['Servers'][$i]['user'] = $_ENV['PMA_USER'];
        $cfg['Servers'][$i]['password'] = isset($_ENV['PMA_PASSWORD']) ? $_ENV['PMA_PASSWORD'] : '';
    } else {
        $cfg['Servers'][$i]['auth_type'] = 'cookie';
    }
    if (isset($_ENV['PMA_PMADB'])) {
      $cfg['Servers'][$i]['pmadb'] = $_ENV['PMA_PMADB'];
      $cfg['Servers'][$i]['relation'] = 'pma__relation';
      $cfg['Servers'][$i]['table_info'] = 'pma__table_info';
      $cfg['Servers'][$i]['table_coords'] = 'pma__table_coords';
      $cfg['Servers'][$i]['pdf_pages'] = 'pma__pdf_pages';
      $cfg['Servers'][$i]['column_info'] = 'pma__column_info';
      $cfg['Servers'][$i]['bookmarktable'] = 'pma__bookmark';
      $cfg['Servers'][$i]['history'] = 'pma__history';
      $cfg['Servers'][$i]['recent'] = 'pma__recent';
      $cfg['Servers'][$i]['favorite'] = 'pma__favorite';
      $cfg['Servers'][$i]['table_uiprefs'] = 'pma__table_uiprefs';
      $cfg['Servers'][$i]['tracking'] = 'pma__tracking';
      $cfg['Servers'][$i]['userconfig'] = 'pma__userconfig';
      $cfg['Servers'][$i]['users'] = 'pma__users';
      $cfg['Servers'][$i]['usergroups'] = 'pma__usergroups';
      $cfg['Servers'][$i]['navigationhiding'] = 'pma__navigationhiding';
      $cfg['Servers'][$i]['savedsearches'] = 'pma__savedsearches';
      $cfg['Servers'][$i]['central_columns'] = 'pma__central_columns';
      $cfg['Servers'][$i]['designer_settings'] = 'pma__designer_settings';
      $cfg['Servers'][$i]['export_templates'] = 'pma__export_templates';
    }
    if (isset($_ENV['PMA_CONTROLHOST'])) {
      $cfg['Servers'][$i]['controlhost'] = $_ENV['PMA_CONTROLHOST'];
    }
    if (isset($_ENV['PMA_CONTROLPORT'])) {
      $cfg['Servers'][$i]['controlport'] = $_ENV['PMA_CONTROLPORT'];
    }
    if (isset($_ENV['PMA_CONTROLUSER'])) {
      $cfg['Servers'][$i]['controluser'] = $_ENV['PMA_CONTROLUSER'];
    }
    if (isset($_ENV['PMA_CONTROLPASS'])) {
      $cfg['Servers'][$i]['controlpass'] = $_ENV['PMA_CONTROLPASS'];
    }
    $cfg['Servers'][$i]['compress'] = false;
    $cfg['Servers'][$i]['AllowNoPassword'] = true;
}
for ($i = 1; isset($sockets[$i - 1]); $i++) {
    $cfg['Servers'][$i]['socket'] = $sockets[$i - 1];
    $cfg['Servers'][$i]['host'] = 'localhost';
}
/*
 * Revert back to last configured server to make
 * it easier in config.user.inc.php
 */
$i--;

/* Uploads setup */
if (isset($_ENV['PMA_UPLOADDIR'])) {
    $cfg['UploadDir'] = $_ENV['PMA_UPLOADDIR'];
}

if (isset($_ENV['PMA_SAVEDIR'])) {
    $cfg['SaveDir'] = $_ENV['PMA_SAVEDIR'];
}

if (isset($_ENV['MAX_EXECUTION_TIME'])) {
    $cfg['ExecTimeLimit'] = $_ENV['MAX_EXECUTION_TIME'];
}

if (isset($_ENV['MEMORY_LIMIT'])) {
    $cfg['MemoryLimit'] = $_ENV['MEMORY_LIMIT'];
}

/* Include User Defined Settings Hook */
if (file_exists('/etc/phpmyadmin/config.user.inc.php')) {
    include '/etc/phpmyadmin/config.user.inc.php';
}

/* Support additional configurations */
if (is_dir('/etc/phpmyadmin/conf.d/')) {
    foreach (glob('/etc/phpmyadmin/conf.d/*.php') as $filename) {
        include $filename;
    }
}