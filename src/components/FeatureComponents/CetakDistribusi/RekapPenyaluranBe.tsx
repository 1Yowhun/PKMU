import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { formatNumberQty } from "@/utils/page";
import { id } from "date-fns/locale";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingVertical: 50,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: "Times-Roman",
  },
  header: {
    marginBottom: 20,
    textAlign: "left",
  },
  title: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    fontWeight: "extrabold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 10,
  },
  table: {
    marginTop: 10,
    width: "100%",
    // borderWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    fontSize: 12,
    padding: 5,
    fontWeight: "bold",
    // borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontFamily: "Times-Bold",
  },
  tableCell: {
    padding: 5,
    // borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
  },
  noResultsRow: {
    flexDirection: "row",
    minHeight: 50, // Ensure some height for visibility
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 12,
  },
});

const RekapPenyaluranBe = ({ data, company, isAgentFiltered }: any) => {
  const TOTAL = data.reduce((acc: any, item: any) => {
    const subtotal = item.records.reduce(
      (sum: any, record: any) => sum + record.allocatedQty,
      0
    );
    return acc + subtotal;
  }, 0);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{company.companyName}</Text>
          <Text style={styles.subHeader}>
            STASIUN PENGISIAN DAN PENGANGKUTAN BULK ELPIJI (SPPBE)
          </Text>
          <Text style={styles.subHeader}>{company.address}</Text>
          <Text style={styles.subHeader}>Telp/Fax: {company.telephone}</Text>
        </View>

        <Text
          style={[
            styles.title,
            { textAlign: "center", fontFamily: "Times-Bold" },
          ]}
        >
          Penyaluran Elpiji 3 Kg
        </Text>

        {data && data.length > 0 ? (
          <View style={{ marginVertical: 20 }}>
            {data.map((item: any, index: number) => (
              <View key={index} style={{ marginBottom: 30 }}>
                <Text style={{ marginTop: 5 }}>
                  Penyaluran Tanggal:{" "}
                  <Text style={{ fontFamily: "Times-Bold" }}>
                    {format(new Date(item.date), "EEEE, dd MMMM yyyy", {
                      locale: id,
                    })}
                  </Text>
                </Text>

                <View style={styles.table}>
                  {/* Table Header */}
                  <View style={styles.tableRow} wrap={false}>
                    <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>
                      No Transaksi
                    </Text>
                    <Text style={[styles.tableCellHeader, { flex: 3 }]}>
                      Nama Agen
                    </Text>
                    <Text style={[styles.tableCellHeader, { flex: 1 }]}>
                      Sopir
                    </Text>
                    <Text style={[styles.tableCellHeader, { flex: 1 }]}>
                      Nopol
                    </Text>
                    <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>
                      No DO
                    </Text>
                    <Text style={[styles.tableCellHeader, { flex: 1 }]}>
                      Status
                    </Text>
                    <Text style={[styles.tableCellHeader, { flex: 1 }]}>
                      Jumlah
                    </Text>
                    <Text style={[styles.tableCellHeader, { flex: 1 }]}>
                      Kg
                    </Text>
                  </View>

                  {/* Table Body */}
                  {item.records.map(
                    (record: any, idx: number) => (
                      (item.quantity.totalDistributionQty +=
                        record.allocatedQty),
                      (
                        <View
                          key={`${index}-${idx}`}
                          style={styles.tableRow}
                          wrap={false}
                        >
                          <Text
                            style={[styles.tableCell, { flex: 1.5 }]}
                            wrap={false}
                          >
                            {record.bpeNumber}
                          </Text>
                          <Text
                            style={[styles.tableCell, { flex: 3, fontSize: 9 }]}
                            wrap={false}
                          >
                            {record.agentName}
                          </Text>
                          <Text
                            style={[styles.tableCell, { flex: 1, fontSize: 9 }]}
                            wrap={false}
                          >
                            {record.driverName}
                          </Text>
                          <Text
                            style={[styles.tableCell, { flex: 1, fontSize: 9 }]}
                            wrap={false}
                          >
                            {record.licensePlate}
                          </Text>
                          <Text
                            style={[styles.tableCell, { flex: 1.5 }]}
                            wrap={false}
                          >
                            {record.deliveryNumber}
                          </Text>
                          <Text
                            style={[styles.tableCell, { flex: 1 }]}
                            wrap={false}
                          >
                            {record.materialName}
                          </Text>
                          <Text
                            style={[styles.tableCell, { flex: 1 }]}
                            wrap={false}
                          >
                            {formatNumberQty(record.allocatedQty)}
                          </Text>
                          <Text
                            style={[styles.tableCell, { flex: 1 }]}
                            wrap={false}
                          >
                            {formatNumberQty(record.volume)}
                          </Text>
                        </View>
                      )
                    )
                  )}
                  <View wrap={false}>
                    <View
                      style={[styles.tableRow, styles.summaryRow]}
                      wrap={false}
                    >
                      <Text
                        style={[
                          styles.tableCell,
                          {
                            flex: 11,
                            fontWeight: "bold",
                            textAlign: "left",
                            fontFamily: "Times-Bold",
                          },
                        ]}
                        wrap={false}
                      >
                        Sub Total
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          { flex: 1, fontWeight: "bold" },
                        ]}
                        wrap={false}
                      >
                        {formatNumberQty(item.quantity.totalAllocatedQty)}
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          { flex: 1, fontWeight: "bold" },
                        ]}
                        wrap={false}
                      >
                        {formatNumberQty(item.quantity.totalAllocatedQty * 3)}
                      </Text>
                    </View>
                    {isAgentFiltered == "" && (
                      <>
                        <View
                          style={[styles.tableRow, styles.summaryRow]}
                          wrap={false}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              {
                                flex: 11,
                                fontWeight: "bold",
                                textAlign: "left",
                                fontFamily: "Times-Bold",
                              },
                            ]}
                            wrap={false}
                          >
                            Total Pending
                          </Text>
                          <Text
                            style={[
                              styles.tableCell,
                              { flex: 1, fontWeight: "bold" },
                            ]}
                            wrap={false}
                          >
                            {formatNumberQty(item.quantity.totalPending)}
                          </Text>
                          <Text
                            style={[
                              styles.tableCell,
                              { flex: 1, fontWeight: "bold" },
                            ]}
                            wrap={false}
                          >
                            {formatNumberQty(item.quantity.totalPending * 3)}
                          </Text>
                        </View>

                        <View
                          style={[styles.tableRow, styles.summaryRow]}
                          wrap={false}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              {
                                flex: 11,
                                fontWeight: "bold",
                                textAlign: "left",
                                fontFamily: "Times-Bold",
                              },
                            ]}
                            wrap={false}
                          >
                            Total Fakultatif
                          </Text>
                          <Text
                            style={[
                              styles.tableCell,
                              { flex: 1, fontWeight: "bold" },
                            ]}
                            wrap={false}
                          >
                            {formatNumberQty(item.quantity.totalFakultatif)}
                          </Text>
                          <Text
                            style={[
                              styles.tableCell,
                              { flex: 1, fontWeight: "bold" },
                            ]}
                            wrap={false}
                          >
                            {formatNumberQty(item.quantity.totalFakultatif * 3)}
                          </Text>
                        </View>

                        <View
                          style={[styles.tableRow, styles.summaryRow]}
                          wrap={false}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              {
                                flex: 11,
                                fontWeight: "bold",
                                textAlign: "left",
                                fontFamily: "Times-Bold",
                              },
                            ]}
                            wrap={false}
                          >
                            Total LO Tidak Ditebus
                          </Text>
                          <Text
                            style={[
                              styles.tableCell,
                              { flex: 1, fontWeight: "bold" },
                            ]}
                            wrap={false}
                          >
                            {formatNumberQty(item.quantity.totalLo)}
                          </Text>
                          <Text
                            style={[
                              styles.tableCell,
                              { flex: 1, fontWeight: "bold" },
                            ]}
                            wrap={false}
                          >
                            {formatNumberQty(item.quantity.totalLo * 3)}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ marginVertical: 20 }}>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>
                  No Transaksi
                </Text>
                <Text style={[styles.tableCellHeader, { flex: 3 }]}>
                  Nama Agen
                </Text>
                <Text style={[styles.tableCellHeader, { flex: 1 }]}>Sopir</Text>
                <Text style={[styles.tableCellHeader, { flex: 1 }]}>Nopol</Text>
                <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>
                  No DO
                </Text>
                <Text style={[styles.tableCellHeader, { flex: 1 }]}>
                  Status
                </Text>
                <Text style={[styles.tableCellHeader, { flex: 1 }]}>
                  Jumlah
                </Text>
                <Text style={[styles.tableCellHeader, { flex: 1 }]}>Kg</Text>
              </View>

              {/* No Results Row */}
              <View style={styles.noResultsRow} wrap={false}>
                <Text style={[styles.noResultsText, { flex: 10 }]} wrap={false}>
                  Data tidak ditemukan
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.table, { marginTop: 20 }]}>
          <View style={styles.tableRow} wrap={false}>
            <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Alokasi</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Jumlah</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Kg</Text>
          </View>
          <View style={[styles.tableRow, styles.summaryRow]} wrap={false}>
            <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>TOTAL</Text>
            <Text style={[styles.tableCell, { flex: 1 }]} wrap={false}>
              {formatNumberQty(TOTAL)}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]} wrap={false}>
              {formatNumberQty(TOTAL * 3)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default RekapPenyaluranBe;
