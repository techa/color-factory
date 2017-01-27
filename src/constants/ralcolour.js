/**
 * http://www.ral-farben.de/
 * http://www.ralcolor.com/
 * (RAL \d+)\s*\n.+?(#[\da-f]+)\n+.+\n+(.+)\n+.+\n+.+\n+.+\n+.+\n+
 * ['#$2', '$1'],\n
 */
export const ralcolour = [
['#CDBA88', 'RAL 1000', 'Green beige'],
['#D0B084', 'RAL 1001', 'Beige'],
['##D2AA6D', 'RAL 1002', 'Sand yellow'],
['##F9A800', 'RAL 1003', 'Signal yellow'],
['##CDA434', 'RAL 1004', 'Golden yellow'],
['##CB8E00', 'RAL 1005', 'Honey yellow'],
['##E29000', 'RAL 1006', 'Maize yellow'],
['##DC9D00', 'RAL 1007', 'Daffodil yellow'],
['##AF804F', 'RAL 1011', 'Brown beige'],
['##C7B446', 'RAL 1012', 'Lemon yellow'],
['##E3D9C6', 'RAL 1013', 'Oyster white'],
['##E1CC4F', 'RAL 1014', 'Ivory'],
['##E6D690', 'RAL 1015', 'Light ivory'],
['##EDFF21', 'RAL 1016', 'Sulfur yellow'],
['##F5D033', 'RAL 1017', 'Saffron yellow'],
['##F8F32B', 'RAL 1018', 'Zinc yellow'],
['##9E9764', 'RAL 1019', 'Grey beige'],
['##999950', 'RAL 1020', 'Olive yellow'],
['##F3DA0B', 'RAL 1021', 'Rape yellow'],
['##FAD201', 'RAL 1023', 'Traffic yellow'],
['##AEA04B', 'RAL 1024', 'Ochre yellow'],
['##FFFF00', 'RAL 1026', 'Luminous yellow'],
['##9D9101', 'RAL 1027', 'Curry'],
['##F4A900', 'RAL 1028', 'Melon yellow'],
['##D6AE01', 'RAL 1032', 'Broom yellow'],
['##F3A505', 'RAL 1033', 'Dahlia yellow'],
['##EFA94A', 'RAL 1034', 'Pastel yellow'],
['##6A5D4D', 'RAL 1035', 'Pearl beige'],
['##705335', 'RAL 1036', 'Pearl gold'],
['##F39F18', 'RAL 1037', 'Sun yellow'],
['##ED760E', 'RAL 2000', 'Yellow orange'],
['##C93C20', 'RAL 2001', 'Red orange'],
['##CB2821', 'RAL 2002', 'Vermilion'],
['##FF7514', 'RAL 2003', 'Pastel orange'],
['##F44611', 'RAL 2004', 'Pure orange'],
['##FF2301', 'RAL 2005', 'Luminous orange'],
['##FFA420', 'RAL 2007', 'Luminous bright orange'],
['##F75E25', 'RAL 2008', 'Bright red orange'],
['##F54021', 'RAL 2009', 'Traffic orange'],
['##D84B20', 'RAL 2010', 'Signal orange'],
['##EC7C26', 'RAL 2011', 'Deep orange'],
['##E55137', 'RAL 2012', 'Salmon range'],
['##C35831', 'RAL 2013', 'Pearl orange'],
['##AF2B1E', 'RAL 3000', 'Flame red'],
['##A52019', 'RAL 3001', 'Signal red'],
['##A2231D', 'RAL 3002', 'Carmine red'],
['##9B111E', 'RAL 3003', 'Ruby red'],
['##75151E', 'RAL 3004', 'Purple red'],
['##5E2129', 'RAL 3005', 'Wine red'],
['##412227', 'RAL 3007', 'Black red'],
['##642424', 'RAL 3009', 'Oxide red'],
['##781F19', 'RAL 3011', 'Brown red'],
['##C1876B', 'RAL 3012', 'Beige red'],
['##A12312', 'RAL 3013', 'Tomato red'],
['##D36E70', 'RAL 3014', 'Antique pink'],
['##EA899A', 'RAL 3015', 'Light pink'],
['##B32821', 'RAL 3016', 'Coral red'],
['##E63244', 'RAL 3017', 'Rose'],
['##D53032', 'RAL 3018', 'Strawberry red'],
['##CC0605', 'RAL 3020', 'Traffic red'],
['##D95030', 'RAL 3022', 'Salmon pink'],
['##F80000', 'RAL 3024', 'Luminous red'],
['##FE0000', 'RAL 3026', 'Luminous'],
['##C51D34', 'RAL 3027', 'Raspberry red'],
['##CB3234', 'RAL 3028', 'Pure  red'],
['##B32428', 'RAL 3031', 'Orient red'],
['##721422', 'RAL 3032', 'Pearl ruby red'],
['##B44C43', 'RAL 3033', 'Pearl pink'],
['##6D3F5B', 'RAL 4001', 'Red lilac'],
['##922B3E', 'RAL 4002', 'Red violet'],
['##DE4C8A', 'RAL 4003', 'Heather violet'],
['##641C34', 'RAL 4004', 'Claret violet'],
['##6C4675', 'RAL 4005', 'Blue lilac'],
['##A03472', 'RAL 4006', 'Traffic purple'],
['##4A192C', 'RAL 4007', 'Purple violet'],
['##924E7D', 'RAL 4008', 'Signal violet'],
['##A18594', 'RAL 4009', 'Pastel violet'],
['##CF3476', 'RAL 4010', 'Telemagenta'],
['##8673A1', 'RAL 4011', 'Pearl violet'],
['##6C6874', 'RAL 4012', 'Pearl black berry'],
['##354D73', 'RAL 5000', 'Violet blue'],
['##1F3438', 'RAL 5001', 'Green blue'],
['##20214F', 'RAL 5002', 'Ultramarine blue'],
['##1D1E33', 'RAL 5003', 'Saphire blue'],
['##18171C', 'RAL 5004', 'Black blue'],
['##1E2460', 'RAL 5005', 'Signal blue'],
['##3E5F8A', 'RAL 5007', 'Brillant blue'],
['##26252D', 'RAL 5008', 'Grey blue'],
['##025669', 'RAL 5009', 'Azure blue'],
['##0E294B', 'RAL 5010', 'Gentian blue'],
['##231A24', 'RAL 5011', 'Steel blue'],
['##3B83BD', 'RAL 5012', 'Light blue'],
['##1E213D', 'RAL 5013', 'Cobalt blue'],
['##606E8C', 'RAL 5014', 'Pigeon blue'],
['##2271B3', 'RAL 5015', 'Sky blue'],
['##063971', 'RAL 5017', 'Traffic blue'],
['##3F888F', 'RAL 5018', 'Turquoise blue'],
['##1B5583', 'RAL 5019', 'Capri blue'],
['##1D334A', 'RAL 5020', 'Ocean blue'],
['##256D7B', 'RAL 5021', 'Water blue'],
['##252850', 'RAL 5022', 'Night blue'],
['##49678D', 'RAL 5023', 'Distant blue'],
['##5D9B9B', 'RAL 5024', 'Pastel blue'],
['##2A6478', 'RAL 5025', 'Pearl gentian blue'],
['##102C54', 'RAL 5026', 'Pearl night blue'],
['##316650', 'RAL 6000', 'Patina green'],
['##287233', 'RAL 6001', 'Emerald green'],
['##2D572C', 'RAL 6002', 'Leaf green'],
['##424632', 'RAL 6003', 'Olive green'],
['##1F3A3D', 'RAL 6004', 'Blue green'],
['##2F4538', 'RAL 6005', 'Moss green'],
['##3E3B32', 'RAL 6006', 'Grey olive'],
['##343B29', 'RAL 6007', 'Bottle green'],
['##39352A', 'RAL 6008', 'Brown green'],
['##31372B', 'RAL 6009', 'Fir green'],
['##35682D', 'RAL 6010', 'Grass green'],
['##587246', 'RAL 6011', 'Reseda green'],
['##343E40', 'RAL 6012', 'Black green'],
['##6C7156', 'RAL 6013', 'Reed green'],
['##47402E', 'RAL 6014', 'Yellow olive'],
['##3B3C36', 'RAL 6015', 'Black olive'],
['##1E5945', 'RAL 6016', 'Turquoise green'],
['##4C9141', 'RAL 6017', 'May green'],
['##57A639', 'RAL 6018', 'Yellow green'],
['##BDECB6', 'RAL 6019', 'Pastel green'],
['##2E3A23', 'RAL 6020', 'Chrome green'],
['##89AC76', 'RAL 6021', 'Pale green'],
['##25221B', 'RAL 6022', 'Olive drab'],
['##308446', 'RAL 6024', 'Traffic green'],
['##3D642D', 'RAL 6025', 'Fern green'],
['##015D52', 'RAL 6026', 'Opal green'],
['##84C3BE', 'RAL 6027', 'Light green'],
['##2C5545', 'RAL 6028', 'Pine green'],
['##20603D', 'RAL 6029', 'Mint green'],
['##317F43', 'RAL 6032', 'Signal green'],
['##497E76', 'RAL 6033', 'Mint turquoise'],
['##7FB5B5', 'RAL 6034', 'Pastel turquoise'],
['##1C542D', 'RAL 6035', 'Pearl green'],
['##193737', 'RAL 6036', 'Pearl opal green'],
['##008F39', 'RAL 6037', 'Pure green'],
['##00BB2D', 'RAL 6038', 'Luminous green'],
['##78858B', 'RAL 7000', 'Squirrel grey'],
['##8A9597', 'RAL 7001', 'Silver grey'],
['##7E7B52', 'RAL 7002', 'Olive grey'],
['##6C7059', 'RAL 7003', 'Moss grey'],
['##969992', 'RAL 7004', 'Signal grey'],
['##646B63', 'RAL 7005', 'Mouse grey'],
['##6D6552', 'RAL 7006', 'Beige grey'],
['##6A5F31', 'RAL 7008', 'Khaki grey'],
['##4D5645', 'RAL 7009', 'Green grey'],
['##4C514A', 'RAL 7010', 'Tarpaulin grey'],
['##434B4D', 'RAL 7011', 'Iron grey'],
['##4E5754', 'RAL 7012', 'Basalt grey'],
['##464531', 'RAL 7013', 'Brown grey'],
['##434750', 'RAL 7015', 'Slate grey'],
['##293133', 'RAL 7016', 'Anthracite grey'],
['##23282B', 'RAL 7021', 'Black grey'],
['##332F2C', 'RAL 7022', 'Umbra grey'],
['##686C5E', 'RAL 7023', 'Concrete grey'],
['##474A51', 'RAL 7024', 'Graphite grey'],
['##2F353B', 'RAL 7026', 'Granite grey'],
['##8B8C7A', 'RAL 7030', 'Stone grey'],
['##474B4E', 'RAL 7031', 'Blue grey'],
['##B8B799', 'RAL 7032', 'Pebble grey'],
['##7D8471', 'RAL 7033', 'Cement grey'],
['##8F8B66', 'RAL 7034', 'Yellow grey'],
['##D7D7D7', 'RAL 7035', 'Light grey'],
['##7F7679', 'RAL 7036', 'Platinum grey'],
['##7D7F7D', 'RAL 7037', 'Dusty grey'],
['##B5B8B1', 'RAL 7038', 'Agate grey'],
['##6C6960', 'RAL 7039', 'Quartz grey'],
['##9DA1AA', 'RAL 7040', 'Window grey'],
['##8D948D', 'RAL 7042', 'Traffic grey A'],
['##4E5452', 'RAL 7043', 'Traffic grey B'],
['##CAC4B0', 'RAL 7044', 'Silk grey'],
['##909090', 'RAL 7045', 'Telegrey 1'],
['##82898F', 'RAL 7046', 'Telegrey 2'],
['##D0D0D0', 'RAL 7047', 'Telegrey 4'],
['##898176', 'RAL 7048', 'Pearl mouse grey'],
['##826C34', 'RAL 8000', 'Green brown'],
['##955F20', 'RAL 8001', 'Ochre brown'],
['##6C3B2A', 'RAL 8002', 'Signal brown'],
['##734222', 'RAL 8003', 'Clay brown'],
['##8E402A', 'RAL 8004', 'Copper brown'],
['##59351F', 'RAL 8007', 'Fawn brown'],
['##6F4F28', 'RAL 8008', 'Olive brown'],
['##5B3A29', 'RAL 8011', 'Nut brown'],
['##592321', 'RAL 8012', 'Red brown'],
['##382C1E', 'RAL 8014', 'Sepia brown'],
['##633A34', 'RAL 8015', 'Chestnut brown'],
['##4C2F27', 'RAL 8016', 'Mahogany brown'],
['##45322E', 'RAL 8017', 'braun'],
['##403A3A', 'RAL 8019', 'Grey brown'],
['##212121', 'RAL 8022', 'Black brown'],
['##A65E2E', 'RAL 8023', 'Orange brown'],
['##79553D', 'RAL 8024', 'Beige brown'],
['##755C48', 'RAL 8025', 'Pale brown'],
['##4E3B31', 'RAL 8028', 'Terra brown'],
['##763C28', 'RAL 8029', 'Pearl copper'],
['##FDF4E3', 'RAL 9001', 'Cream'],
['##E7EBDA', 'RAL 9002', 'Grey white'],
['##F4F4F4', 'RAL 9003', 'Signal white'],
['##282828', 'RAL 9004', 'Signal black'],
['##0A0A0A', 'RAL 9005', 'Jet black'],
['##A5A5A5', 'RAL 9006', 'White aluminium'],
['##8F8F8F', 'RAL 9007', 'Grey aluminium'],
['##FFFFFF', 'RAL 9010', 'Pure white'],
['##1C1C1C', 'RAL 9011', 'Graphite black'],
['##F6F6F6', 'RAL 9016', 'Traffic white'],
['##1E1E1E', 'RAL 9017', 'schwarz'],
['##D7D7D7', 'RAL 9018', 'Papyrus white'],
['##9C9C9C', 'RAL 9022', 'Pearl light grey'],
['##828282', 'RAL 9023', 'Pearl dark grey'],
]