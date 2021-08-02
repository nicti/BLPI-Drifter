-- Query WH connections from pathfinder DB
SELECT `sourceTbl`.`systemId` AS `src`,`targetTbl`.`systemId` as `tgt` FROM `connection`
JOIN `system` AS sourceTbl ON `connection`.`source`=`sourceTbl`.`id`
JOIN `system` AS targetTbl ON `connection`.`target`=`targetTbl`.`id`
WHERE `sourceTbl`.`systemId` IN (31000003,31000006,31000001,31000002,31000004)
OR `targetTbl`.`systemId` IN (31000003,31000006,31000001,31000002,31000004);
--Query systems from universe DB
SELECT id,name FROM `system`;