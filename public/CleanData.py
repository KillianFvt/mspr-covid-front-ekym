import pandas as pd
import sys
import os

def clean_data(input_file, output_file=None):

    try:
        print(f"Lecture du fichier {input_file}...")
        df = pd.read_csv(input_file)
        colonnes_initiales = len(df.columns)

        colonnes_a_supprimer = [col for col in df.columns if 'smoothed' in col.lower()]
        df = df.drop(columns=colonnes_a_supprimer)

        lignes_initiales = len(df)
        df = df.dropna(subset=['continent', 'location', 'date'])
        lignes_supprimees = lignes_initiales - len(df)

        if not output_file:
            base, ext = os.path.splitext(input_file)
            output_file = f"{base}_cleaned{ext}"

        df.to_csv(output_file, index=False)

        print(f"Nettoyage terminé. {len(colonnes_a_supprimer)} colonnes supprimées.")
        print(f"Lignes sans continent ou location supprimées: {lignes_supprimees}")
        print(f"Colonnes initiales: {colonnes_initiales}")
        print(f"Colonnes restantes: {len(df.columns)}")
        print(f"Lignes initiales: {lignes_initiales}")
        print(f"Lignes restantes: {len(df)}")
        print(f"Fichier nettoyé enregistré sous: {output_file}")

        return True

    except Exception as e:
        print(f"Erreur lors du traitement du fichier: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python CleanData.py fichier_entree.csv [fichier_sortie.csv]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    clean_data(input_file, output_file)