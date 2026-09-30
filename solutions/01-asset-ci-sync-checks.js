// Reference solution: Script exercise 1 (read-only checks)
// Run in Scripts - Background on a PDI.

(function () {
    var LIMIT = 50; // cap output per check

    function report(name, count) {
        gs.info('[' + name + '] ' + count + ' records');
    }

    // 1. Assets without a CI, where the model category expects one
    var a = new GlideRecord('alm_hardware');
    a.addNullQuery('ci');
    a.addNotNullQuery('model_category.cmdb_ci_class');
    a.setLimit(LIMIT);
    a.query();
    var c1 = 0;
    while (a.next()) {
        c1++;
        gs.info('  no CI: ' + a.getDisplayValue('asset_tag') + ' (' + a.getDisplayValue('model') + ')');
    }
    report('Assets without CI', c1);

    // 2. CIs without an asset (not retired)
    var ci = new GlideRecord('cmdb_ci_computer');
    ci.addNullQuery('asset');
    ci.addQuery('install_status', '!=', '7'); // 7 = Retired; confirm the value in your instance's choice list
    ci.setLimit(LIMIT);
    ci.query();
    var c2 = 0;
    while (ci.next()) {
        c2++;
        gs.info('  no asset: ' + ci.getValue('name'));
    }
    report('CIs without asset', c2);

    // 3. Broken back-references (asset.ci.asset != asset)
    var b = new GlideRecord('alm_hardware');
    b.addNotNullQuery('ci');
    b.query();
    var c3 = 0;
    while (b.next()) {
        if (b.ci.asset.toString() != b.getUniqueValue()) {
            c3++;
            if (c3 <= LIMIT)
                gs.info('  broken link: ' + b.getDisplayValue('asset_tag') + ' -> ' + b.getDisplayValue('ci') +
                    ' -> ' + b.ci.asset.getDisplayValue());
        }
    }
    report('Broken asset<->CI links', c3);

    // 4. Duplicate serial numbers on computers
    var ga = new GlideAggregate('cmdb_ci_computer');
    ga.addNotNullQuery('serial_number');
    ga.addAggregate('COUNT');
    ga.groupBy('serial_number');
    ga.addHaving('COUNT', '>', '1');
    ga.query();
    var c4 = 0;
    while (ga.next()) {
        c4++;
        gs.info('  duplicate serial: ' + ga.getValue('serial_number') + ' x' + ga.getAggregate('COUNT'));
    }
    report('Duplicate serial numbers', c4);

    // 5. Asset retired but CI not retired
    var r = new GlideRecord('alm_hardware');
    r.addQuery('install_status', '7'); // Retired: check the value in your instance's choice list
    r.addNotNullQuery('ci');
    r.addQuery('ci.install_status', '!=', '7');
    r.setLimit(LIMIT);
    r.query();
    var c5 = 0;
    while (r.next()) {
        c5++;
        gs.info('  lifecycle mismatch: ' + r.getDisplayValue('asset_tag') + ' CI status=' +
            r.ci.install_status.getDisplayValue());
    }
    report('Retired asset / active CI', c5);
})();

/*
Notes
- Check 3 loops over every linked asset. On a big instance, run it as a scheduled job or batch it.
  An alternative is a Database View joining alm_hardware and cmdb_ci on ci/asset.
- Never hard-code choice values blindly. Verify them in sys_choice for your instance.
- CMDB Health (Correctness → Duplicates) catches check 4 out of the box. Orphan and staleness rules
  cover part of 2. Checks 1, 3 and 5 are HAM/CMDB consistency checks you usually build yourself.
*/
