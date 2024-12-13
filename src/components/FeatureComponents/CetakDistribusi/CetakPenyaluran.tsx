import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { formatNumberQty, toNormalCase } from "@/utils/page";

interface CetakPenyaluranProps {
  data: any;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: "Times-Roman",
  },
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  header: {
    flex: 1,
    marginRight: 16,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "flex-start",
  },
  imageSize: {
    width: 120,
    height: 120,
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
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  detailsColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  detailsLabel: {
    fontWeight: "bold",
    width: "25%",
  },
  detailsValue: {
    width: "60%",
    textAlign: "left",
  },
  table: {
    marginTop: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    padding: 5,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontFamily: "Times-Bold",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    textAlign: "right",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  signature: {
    textAlign: "center",
    marginHorizontal: 20,
    flex: 1,
  },
  signatureLine: {
    marginTop: 75,
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "90%",
  },
  footerText: {
    fontSize: 9,
    marginTop: 12,
    textAlign: "left",
  },
});

const CetakPenyaluran: React.FC<CetakPenyaluranProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>PT. Puri Kencana Merdeka Utama</Text>
          <Text style={styles.subHeader}>
            STASIUN PENGISIAN DAN PENGANGKUTAN BULK ELPIJI (SPPBE)
          </Text>
          <Text style={styles.subHeader}>
            Kawasan Industri Candi Blok XI No. 8, JL Candi Raya Timur, Ngaliyan,
            Semarang
          </Text>
          <Text style={styles.subHeader}>
            Telp/Fax: 024-76633360 / 024-76633361
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.imageSize}
            src="https://f6oujhgi9dzrtqrk.public.blob.vercel-storage.com/SVG%20to%20PNG%20Conversion%20(1)-Xec3SuuiyCo71J4ndm3O533x0jWGTb.png"
          />
        </View>
      </View>

      {/* Details Section */}
      <Text style={styles.title}>Bukti Penyerahan Elpiji 3 Kg</Text>
      <View style={styles.detailsRow}>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailsLabel}>Jenis Barang</Text>
          <Text style={styles.detailsValue}>: Elpiji 3 Kg</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailsLabel}>Nomor</Text>
          <Text style={styles.detailsValue}>: {data.bpeNumber}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailsLabel}>No. Pol Kend</Text>
          <Text style={styles.detailsValue}>: {data.licensePlate}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailsLabel}>Tanggal</Text>
          <Text style={styles.detailsValue}>
            : {format(new Date(), "dd MMMM yyyy")}
          </Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailsLabel}>Diserahkan ke</Text>
          <Text style={styles.detailsValue}>: {data.agentName}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailsLabel}>Jam</Text>
          <Text style={styles.detailsValue}>
            : {formatTime(new Date().getTime())}
          </Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellHeader, { flex: 2 }]}>No DO/LO</Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>Refill</Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>
            Pengembalian
          </Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>
            Jumlah Isi (Kg)
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "left" }]}>
            {data.deliveryNumber}
          </Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
            {formatNumberQty(data.allocatedQty)}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>0</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            {formatNumberQty(data.allocatedQty * 3)}
          </Text>
        </View>
        {/* Additional Table Rows */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "left" }]}>
            Tabung Bocor
          </Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
            0
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>0</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>0</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "left" }]}>
            Isi Tabung Kurang
          </Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
            0
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>0</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>0</Text>
        </View>
        {/* Total Row */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, textAlign: "center" }]}>
            Jumlah
          </Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
            {formatNumberQty(data.allocatedQty)}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>0</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            {formatNumberQty(data.allocatedQty * 3)}
          </Text>
        </View>
      </View>

      {/* Note Section */}
      <View style={{ marginTop: 10 }}>
        <Text>
          Telah diserahkan dan diterima dalam keadaan baik, jumlah tabung dan
          isi benar
        </Text>
        <Text style={{ textAlign: "right", marginTop: 10 }}>
          Semarang, {format(new Date(), "dd MMMM yyyy")}
        </Text>
      </View>

      {/* Signature Section */}
      <View style={styles.signatureRow}>
        <View style={styles.signature}>
          <Text style={{ textAlign: "center" }}>Administrasi</Text>
          <Text style={styles.signatureLine} />
          <Text style={{ textAlign: "center" }}>
            {toNormalCase(data.administrasi || "")}
          </Text>
        </View>
        <View style={styles.signature}>
          <Text style={{ textAlign: "center" }}>Gate Keeper</Text>
          <Text style={styles.signatureLine} />
          <Text style={{ textAlign: "center" }}>
            {toNormalCase(data.gateKeeper || "")}
          </Text>
        </View>
        <View style={styles.signature}>
          <Text style={{ textAlign: "center" }}>Spv. Filling</Text>
          <Text style={styles.signatureLine} />
          <Text style={{ textAlign: "center" }}>
            {toNormalCase(data.superVisor || "")}
          </Text>
        </View>
        <View style={styles.signature}>
          <Text style={{ textAlign: "center" }}>Penerima</Text>
          <Text style={styles.signatureLine} />
          <Text style={{ textAlign: "center" }}>
            {toNormalCase(data.driverName)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        *Hanya untuk keperluan internal. Jika ditemukan harap kembalikan ke
        SPPBE.
      </Text>
    </Page>
  </Document>
);

export default CetakPenyaluran;
